// import { productInstockType } from "../type/productType";
import mongoose from 'mongoose';
import ProductsInStock from '../model/ProductsInStock';
import Product from '../model/Product';
import StorageRoom from '../model/StorageRoom'

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
