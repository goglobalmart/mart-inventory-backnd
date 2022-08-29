// import { productInstockType } from "../type/productType";
import mongoose from 'mongoose';
import ProductsInStock from '../model/ProductsInStock';
import Product from '../model/Product';
import StorageRoom from '../model/StorageRoom'
import { productInstockType, productType, productStockOutType } from "../type/productType";
import { assertWrappingType } from 'graphql';

export const numberingGenerator = (numbering: number) => {
    let str = "" + numbering;
    var zero: string = "000000";
    var res: string = zero.substring(0, zero.length - str.length) + str;
    return res
}
export class ReleaseProductMessage {
    private message?: string;
    private iTems: any;

    constructor(items: any) {
        this.iTems = items
    }

    public async getMessage() {
        for await (const element of this.iTems) {
            const qtyNeed = element.qty;
            const allItem = await ProductsInStock.find(
                {
                    stock_Status: "instock",
                    product_Id: new mongoose.Types.ObjectId(element.product_Id),
                    storage_Room_Id: new mongoose.Types.ObjectId(element.storage_Room_Id)
                }
            ).sort({ created_At: 1 }).exec();

            let listQty: Array<number> = [];
            allItem?.forEach(async item => {
                listQty.push(item.qty)
            })

            const initialValue = 0;
            const TotalInsockItemQty = listQty.reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                initialValue
            );

            console.log("Total Qty instock:", TotalInsockItemQty);
            console.log("TqtyNeed:", element.qty)

            if (qtyNeed === TotalInsockItemQty) {
                console.log("qtyNeed === TotalInsockItemQty ok work")
                this.message = `Release Product Created!`
                allItem?.forEach(async item => {
                    await ProductsInStock.findByIdAndUpdate(
                        item._id,
                        {
                            stock_Status: "stockOut",
                            stock_Out: item.qty
                        }
                    ).exec();
                })
            } else if (qtyNeed > TotalInsockItemQty) {
                const getProduc = await Product.findById(element.product_Id).exec();
                const getStorage_Room: any = await StorageRoom.findById(element.storage_Room_Id).exec();
                // storage_Room_Id
                // const pro = getProduc?.name.toString();
                const storage = getStorage_Room?.name.toString();
                // if (getStorage_Room)
                this.message = `${getProduc?.name} in ${storage} is not enough!`

            } else if (qtyNeed < TotalInsockItemQty) {
                this.message = `Release Product Created!`
                console.log("qtyNeed < TotalInsockItemQty ok work")
                let QtyArr: Array<number> = [];

                allItem.forEach(async elementItem => {
                    if (qtyNeed === elementItem.qty) {
                        // currect
                        console.log("qtyNeed === elementItem.qty")
                        await ProductsInStock.findByIdAndUpdate(
                            elementItem._id,
                            {
                                stock_Status: "stockOut",
                                stock_Out: qtyNeed
                            }
                        ).exec();
                    } else if (qtyNeed > elementItem.qty) {
                        console.log("qtyNeed > elementItem.qty ok work")
                        await ProductsInStock.findByIdAndUpdate(
                            elementItem._id,
                            {
                                stock_Status: "stockOut",
                                stock_Out: qtyNeed - elementItem.qty
                            }
                        ).exec();
                        QtyArr.push(qtyNeed - elementItem.qty);
                    } else if (qtyNeed > elementItem.qty && QtyArr.length > 1 && QtyArr[0] > elementItem.qty) {
                        console.log("qtyNeed > elementItem.qty && QtyArr.length > 1 && QtyArr[0] > elementItem.qty")
                        await ProductsInStock.findByIdAndUpdate(
                            elementItem._id,
                            {
                                stock_Status: "stockOut",
                                stock_Out: QtyArr[0] - elementItem.qty
                            }
                        ).exec();
                        QtyArr.push(QtyArr[0] - elementItem.qty);
                    } else if (qtyNeed > elementItem.qty && QtyArr.length > 1 && QtyArr[0] === elementItem.qty) {
                        console.log("qtyNeed > elementItem.qty && QtyArr.length > 1 && QtyArr[0] === elementItem.qty")
                        await ProductsInStock.findByIdAndUpdate(
                            elementItem._id,
                            {
                                stock_Status: "stockOut",
                                stock_Out: elementItem.qty
                            }
                        ).exec();
                    } else if (qtyNeed > elementItem.qty && QtyArr.length > 1 && QtyArr[0] < elementItem.qty) {
                        console.log("qtyNeed > elementItem.qty && QtyArr.length > 1 && QtyArr[0] < elementItem.qty")
                        await ProductsInStock.findByIdAndUpdate(
                            elementItem._id,
                            {
                                stock_Status: "stockOut",
                                stock_Out: QtyArr[0],
                                qty: elementItem.qty - QtyArr[0]
                            }
                        ).exec();
                    }
                    else if (qtyNeed < elementItem.qty) {
                        console.log("qtyNeed < elementItem.qty ok work")
                        const getLastItem = await ProductsInStock.findOne(
                            {
                                stock_Status: "instock",
                                product_Id: new mongoose.Types.ObjectId(element.product_Id),
                                storage_Room_Id: new mongoose.Types.ObjectId(element.storage_Room_Id)
                            }
                        ).sort({ created_At: 1 }).exec();
                        await ProductsInStock.findByIdAndUpdate(
                            getLastItem?._id,
                            {
                                stock_Out: qtyNeed,
                                qty: elementItem.qty - qtyNeed
                            }
                        ).exec();
                    }
                    else {
                        console.log("ruun eles")
                    }
                })

            }
        }
        return await this.message;
    }
}

export class getProductOnHandReportClass {
    private stock_Name?: string;
    private items: any

    constructor() {
    }

    public async getMessage() {
        let productReport: {}[] = [];
        const getStorageRoom = await StorageRoom.find().exec();
        if (!getStorageRoom) {
            return {
                message: "No Storage Room",
                status: false,
                data: null
            }
        }
        getStorageRoom.forEach(async element => {
            const getProduct = await ProductsInStock.find({
                storage_Room_Id: element._id,
                status: false,
                stock_Status: "instock"
            }).populate<{ product_Id: productType }>('product_Id');
            console.log(getProduct)
            // if (getProduct.length > 0) {
            productReport.push(getProduct)
            // }
            console.log("kk", productReport)
        })
        let tt = await productReport;
        console.log("tt", tt)
    }
}

export class ProductFifo {

    private QtyNeed: number;
    private QtyInstock?: any;
    private QtyCheck?: boolean;
    public message = "";
    constructor() {
        this.QtyNeed = 0;
        // this.message = "defualt"
    }
    // public getDate(qtyNeed: number, qtyInstock: any) {
    public async getDate(qtyNeed: number, qtyInstock: any) {
        console.log("qty need", qtyNeed)
        // console.log(qtyInstock)
        let listQty: Array<number> = [];
        for (const item of qtyInstock) {
            listQty.push(item.qty)
        }
        const initialValue = 0;
        const TotalInsockItemQty = listQty.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            initialValue
        );
        console.log("TotalInsockItemQty", TotalInsockItemQty)
        if (TotalInsockItemQty < qtyNeed) {
            this.QtyCheck = false
        } else {
            this.QtyCheck = true
        }

        this.QtyNeed = qtyNeed;
        this.QtyInstock = qtyInstock;

        if (!this.QtyCheck) {
            this.message = `Product in Stock is not enouge!`
            return `Product in Stock is not enouge!`
        }


        for (const instock of this.QtyInstock) {
            if (instock.qty == this.QtyNeed) {
                console.log(`instock: ${instock.qty}=>Update: qty=${0},stockSatuse="stockOut", stockOut=${instock.qty} | this.QtyNeed=${0}`)
                this.QtyNeed = 0
            } else if (instock.qty > this.QtyNeed && this.QtyNeed != 0) {

                console.log(`instock: ${instock.qty}=>Update: qty=${instock.qty - this.QtyNeed}, stockOut=${this.QtyNeed} | this.QtyNeed=${0}`)
                this.QtyNeed = 0
            } else if (instock.qty < this.QtyNeed) {
                console.log(`instock: ${instock.qty}=>Update: qty=${0},stockSatuse="stockOut" stockOut=${instock.qty} | this.QtyNeed=${this.QtyNeed - instock.qty}`)
                this.QtyNeed = this.QtyNeed - instock.qty
            } else {
                console.log("Run else", this.QtyNeed)
            }

        };
        this.message = await "assaas"

    }
    public async executiveData(): Promise<string> {
        // public executiveData() {
        if (!this.QtyCheck)
            return `Product in Stock is not enouge!`

        for await (const instock of this.QtyInstock) {
            if (instock.qty == this.QtyNeed) {
                // console.log("Update: qty=0, stockSatuse=stockOut, stockOut=qty")
                console.log(`instock: ${instock.qty}=>Update: qty=${0},stockSatuse="stockOut", stockOut=${instock.qty} | this.QtyNeed=${0}`)
                this.QtyNeed = 0
            } else if (instock.qty > this.QtyNeed && this.QtyNeed != 0) {

                console.log(`instock: ${instock.qty}=>Update: qty=${instock.qty - this.QtyNeed}, stockOut=${this.QtyNeed} | this.QtyNeed=${0}`)

                this.QtyNeed = 0
            } else if (instock.qty < this.QtyNeed) {
                // console.log("Update: qty=0, stockSatuse=stockOut,stockOut=qty")
                console.log(`instock: ${instock.qty}=>Update: qty=${0},stockSatuse="stockOut" stockOut=${instock.qty} | this.QtyNeed=${this.QtyNeed - instock.qty}`)
                this.QtyNeed = this.QtyNeed - instock.qty
            } else {
                console.log("Run else", this.QtyNeed)
            }

        };
        return "Release produt"
    }
}
export class ProductFifoCheck {
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
                // console.log(allItem)
                let listQty: Array<number> = [];
                for (const item of allItem) {
                    listQty.push(item.qty)
                }
                const initialValue = 0;
                const TotalInsockItemQty = listQty.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );
                console.log("TotalInsockItemQty", TotalInsockItemQty)
                console.log("Qty need", element?.qty)
                if (TotalInsockItemQty < element?.qty) {
                    this.message = `${getStorage_Room?.name} don't hav Enough ${getProduct?.name}, Total in Stock: ${TotalInsockItemQty}!`
                    return true
                } else {
                    return false
                }

            })
        )
        const getStockEnough = res.filter(r => r == false)
        console.log("getStockEnough.length ", getStockEnough.length === 0)
        if (getStockEnough.length === 0) {
            // meaning total product in stock is not enough
            console.log("thsi", this.message)
            return {
                status: true,
                message: this.message
            }
        } else {
            return {
                status: false,
                messsage: `Product in stock is Enough`
            }
        }

    }

    public async getData(productNeed: any) {
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
                            console.log(`instock: ${item.qty}=>Update: qty=${0},stockSatuse="stockOut", stockOut=${item.qty} | this.QtyNeed=${0}`)
                            this.QtyNeed = 0
                            // return `instock: ${item.qty}=>Update: qty=${0},stockSatuse="stockOut", stockOut=${item.qty} | this.QtyNeed=${0}`
                        }
                        else if (item.qty > this.QtyNeed && this.QtyNeed != 0) {
                            await ProductsInStock.findByIdAndUpdate(item._id, {
                                qty: item.qty - this.QtyNeed,
                                stock_Out: this.QtyNeed,
                            }).exec()
                            console.log(`instock: ${item.qty}=>Update: qty=${item.qty - this.QtyNeed}, stockOut=${this.QtyNeed} | this.QtyNeed=${0}`)
                            this.QtyNeed = 0
                            // return `instock: ${item.qty}=>Update: qty=${item.qty - this.QtyNeed}, stockOut=${this.QtyNeed} | this.QtyNeed=${0}`
                        }
                        else if (item.qty < this.QtyNeed) {
                            await ProductsInStock.findByIdAndUpdate(item._id, {
                                qty: 0,
                                stock_Out: item.qty,
                            }).exec()
                            console.log(`instock: ${item.qty}=>Update: qty=${0},stockSatuse="stockOut" stockOut=${item.qty} | this.QtyNeed=${this.QtyNeed - item.qty}`)
                            this.QtyNeed = this.QtyNeed - item.qty
                            // return `instock: ${item.qty}=>Update: qty=${0},stockSatuse="stockOut" stockOut=${item.qty} | this.QtyNeed=${this.QtyNeed - item.qty}`
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


