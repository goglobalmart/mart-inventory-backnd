import { Types } from 'mongoose';

export interface productReleaseType {
    _id: Types.ObjectId,
    shop_Id: Types.ObjectId,
    release_By: Types.ObjectId,
    delivery_By: Types.ObjectId,
    release_Card_Id: String,
    delivery: Boolean,
    status: Boolean,
    numbering: string,
    delivery_At: Date,
    time: string,
    order_Date: Date,
    remark: string,
    items: [
        {
            product_Id: Types.ObjectId,
            qty: number,
            unit_Price: number,
            category: string,
            storage_Room_Id: Types.ObjectId,
            storage_Room_name: string,
            key: Date,
            product_name: string
        }
    ],
    stock_Record: [
        {
            instock_Id: Types.ObjectId,
            qty: number,
        }
    ],
    created_At: Date
}