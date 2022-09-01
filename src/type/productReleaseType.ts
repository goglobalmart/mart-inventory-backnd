import { Types } from 'mongoose';

export interface productReleaseType {
    _id: Types.ObjectId,
    customer_Id: Types.ObjectId,
    release_By: Types.ObjectId,
    delivery_By: Types.ObjectId,
    release_Card_Id: String,
    delivery: Boolean,
    status: Boolean,
    numbering: string,
    delivery_Date: Date,
    order_Date: Date,
    remark: string,
    items: [
        {
            product_Id: Types.ObjectId,
            qty: number,
            unit_Price: number,
            storage_Room_Id: Types.ObjectId,
            storage_Room_name: string,
            key: Date,
            product_name: string
        }
    ],
    created_At: Date
}