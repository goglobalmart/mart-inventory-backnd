import { Types } from 'mongoose';

export interface productType {
    _id: Types.ObjectId,
    product_Id: Types.ObjectId,
    name: string,
    cost: number,
    category: string,
    image_src: string,
    remark: string,
    type: string,
    feature: string,
    unit: string,
    bar_Code: string,
    created_At: Date
}
export interface productInstockType {
    product_Id: Types.ObjectId,
    qty: number,
    stock_Out: number,
    unit_Price: number,
    status: boolean,
    stock_Status: string,
    storage_Room_Id?: Types.ObjectId,
    purchase_Id: Types.ObjectId,
    expire_At: Date,
    instock_At: Date,
    created_At: Date
}

export interface productStockOutType {
    product_Id: Types.ObjectId,
    qty: number,
    unit_Price: number,
    storage_Room_Id: Types.ObjectId,
    storage_Room_name: string,
    key: Date,
    product_name: string,
}
