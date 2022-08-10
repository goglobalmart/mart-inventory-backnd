import { Types } from 'mongoose';

export interface productType {
    product_Id: Types.ObjectId,
    name: string,
    cost: number,
    category: string,
    image_src: string,
    remark: string,
    type: string,
    feature: string,
    unit: string,
    created_At: Date
}
export interface productInstockType {
    product_Id: Types.ObjectId,
    qty: number,
    stock_Out: number,
    unit_Price: number,
    status: boolean,
    stock_Status: string,
    storage_Room_Id: Types.ObjectId,
    purchase_Id: Types.ObjectId,
    expire_At: Date,
    created_At: Date
}
