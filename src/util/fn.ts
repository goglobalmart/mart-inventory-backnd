import mongoose, { Number } from 'mongoose';
import ProductsInStock from '../model/ProductsInStock';
import Product from '../model/Product';
import StorageRoom from '../model/StorageRoom'
import { productStockOutType } from "../type/productType";
import ProductRelease from '../model/ProductRelease';
import colors from 'colors';
colors.enable()

export const numberingGenerator = (numbering: number) => {
    let str = "" + numbering;
    var zero: string = "000000";
    var res: string = zero.substring(0, zero.length - str.length) + str;
    return res
}

export class CheckStock {
    private QtyNeed: number = 0;
    public message?: string;

    public async stockNotEnough(productNeed: any) {
        const res = await Promise.all(
            productNeed.map(async (element: productStockOutType) => {
                const getStorage_Room = await StorageRoom.findById(element?.storage_Room_Id).exec();
                const getProduct = await Product.findById(element?.product_Id).exec();
                const allItem = await ProductsInStock.find(
                    {
                        stock_Status: "instock",
                        product_Id: new mongoose.Types.ObjectId(element?.product_Id),
                        storage_Room_Id: new mongoose.Types.ObjectId(element?.storage_Room_Id)
                    }
                ).sort({ created_At: 1 }).exec();
                let listQty: Array<number> = [];
                for (const item of allItem) {
                    listQty.push(item.qty)
                }
                const initialValue = 0;
                const TotalInsockItemQty = listQty.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );

                if (TotalInsockItemQty < element?.qty) {
                    console.log(`${getProduct?.name} is not Enough!. Qty In Stock: ${TotalInsockItemQty}${getProduct?.unit}.  Qty Need: ${element?.qty}${getProduct?.unit}`.red);
                    this.message = `${getProduct?.name} is not Enough!. Qty In Stock: ${TotalInsockItemQty}.  Qty Need: ${element?.qty}`;
                    return true
                } else {
                    return false
                }

            })
        )
        const checkProdutNotEnough = res.filter(r => r == true)
        if (checkProdutNotEnough.length > 0) {

            console.log("Some Product is Enough Stock!".red);
            return {
                status: true,
                message: this.message
            }
        } else {
            console.log("All Product is Enough Stock!".green);
            return {
                status: false,
                messsage: `All Product is Enough Stock!`
            }
        }

    }

    public async getData(productNeed: any, release_Card_Id: string) {
        await Promise.all(
            productNeed.map(async (element: productStockOutType) => {

                this.QtyNeed = element?.qty;

                const allItem = await ProductsInStock.find(
                    {
                        stock_Status: "instock",
                        product_Id: new mongoose.Types.ObjectId(element.product_Id),
                        storage_Room_Id: new mongoose.Types.ObjectId(element.storage_Room_Id)
                    }
                ).sort({ created_At: 1 }).exec();

                await Promise.all(
                    allItem.map(async (item: any) => {
                        if (item.qty == this.QtyNeed) {
                            await ProductsInStock.findByIdAndUpdate(item._id, {
                                qty: 0,
                                stock_Out: item.qty,
                                stock_Status: "stockOut"
                            }).exec()
                            await ProductRelease.findByIdAndUpdate(
                                release_Card_Id,
                                {
                                    $push: {
                                        stock_Record: {
                                            instock_Id: item._id,
                                            qty: item.qty
                                        }
                                    }
                                }
                            ).exec()

                            // console.log(`instock: ${item.qty}=>Update: qty=${0},stockSatuse="stockOut", stockOut=${item.qty} | this.QtyNeed=${0}`)
                            this.QtyNeed = 0
                        }
                        else if (item.qty > this.QtyNeed && this.QtyNeed != 0) {
                            // let newRhis = this.QtyNeed
                            let qty = item.qty - this.QtyNeed;
                            let stock_Out = this.QtyNeed;
                            console.log(`instock: ${item.qty}=>Update: qty=${item.qty - this.QtyNeed}, stockOut=${this.QtyNeed} | this.QtyNeed=${0}`)


                            this.QtyNeed = 0
                            const ll = await ProductsInStock.findByIdAndUpdate(item._id, {
                                qty,
                                stock_Out,
                            }).exec()
                            await ProductRelease.findByIdAndUpdate(
                                release_Card_Id, {
                                $push: {
                                    stock_Record: {
                                        instock_Id: item._id,
                                        qty: stock_Out
                                    }
                                }
                            }
                            ).exec()
                        }
                        else if (item.qty < this.QtyNeed) {

                            console.log(`instock: ${item.qty}=>Update: qty=${0},stockSatuse="stockOut" stockOut=${item.qty} | this.QtyNeed=${this.QtyNeed - item.qty}`)

                            this.QtyNeed = this.QtyNeed - item.qty
                            const ll = await ProductsInStock.findByIdAndUpdate(item._id, {
                                qty: 0,
                                stock_Out: item.qty,
                                stock_Status: "stockOut"
                            }).exec()
                            await ProductRelease.findByIdAndUpdate(
                                release_Card_Id, {
                                $push: {
                                    stock_Record: {
                                        instock_Id: item._id,
                                        qty: item.qty
                                    }
                                }
                            }
                            ).exec()
                        }
                        else {
                            console.log("Run else", this.QtyNeed)
                        }
                    })
                )

            }));

        return true
    }
}
export class ProductFifoCheck {
    private QtyNeed: number;
    private Product_Id: string;
    private Storage_Id: string;
    private CardId: string;

    constructor(qtyneed: number, product_Id: string, storage_Id: string, cardId: string) {
        this.QtyNeed = qtyneed;
        this.Storage_Id = storage_Id;
        this.Product_Id = product_Id;
        this.CardId = cardId;
    }
    public async calculate() {
        const allItem = await ProductsInStock.find(
            {
                stock_Status: "instock",
                product_Id: new mongoose.Types.ObjectId(this.Product_Id),
                storage_Room_Id: new mongoose.Types.ObjectId(this.Storage_Id)
            }
        ).sort({ created_At: 1 }).exec();
        allItem.forEach(async (item: any) => {
            if (this.QtyNeed === item.qty) {
                console.log(`instock: ${item.qty}=>Update: qty=${0},stockSatuse="stockOut", stockOut=${item.qty} | this.QtyNeed=${0}`)
                this.QtyNeed = 0
                await ProductsInStock.findByIdAndUpdate(item._id, {
                    qty: 0,
                    stock_Out: item.qty,
                    stock_Status: "stockOut"
                }).exec()
                await ProductRelease.findByIdAndUpdate(
                    this.CardId,
                    {
                        $push: {
                            stock_Record: {
                                instock_Id: item._id,
                                qty: item.qty
                            }
                        }
                    }
                ).exec()
            }
            else if (this.QtyNeed < item.qty && this.QtyNeed != 0) {
                let qty = item.qty - this.QtyNeed;
                let stock_Out = this.QtyNeed;
                console.log(`instock: ${item.qty}=>Update: qty=${qty}, stockOut=${stock_Out} | this.QtyNeed=${0}`)
                this.QtyNeed = 0
                await ProductsInStock.findByIdAndUpdate(item._id, {
                    qty,
                    stock_Out,
                }).exec()
                await ProductRelease.findByIdAndUpdate(
                    this.CardId,
                    {
                        $push: {
                            stock_Record: {
                                instock_Id: item._id,
                                qty: stock_Out
                            }
                        }
                    }
                ).exec()
            }
            else if (this.QtyNeed > item.qty) {
                console.log(`instock: ${item.qty}=>Update: qty=${0},stockSatuse="stockOut" stockOut=${item.qty} | this.QtyNeed=${this.QtyNeed - item.qty}`)

                this.QtyNeed = this.QtyNeed - item.qty;
                await ProductsInStock.findByIdAndUpdate(item._id, {
                    qty: 0,
                    stock_Out: item.qty,
                    stock_Status: "stockOut"
                }).exec()
                await ProductRelease.findByIdAndUpdate(
                    this.CardId,
                    {
                        $push: {
                            stock_Record: {
                                instock_Id: item._id,
                                qty: item.qty
                            }
                        }
                    }
                ).exec()
            }
            else {
                console.log("Run else", this.QtyNeed)
            }
        });

        if (allItem)
            return true
        if (!allItem)
            return false
    }
}