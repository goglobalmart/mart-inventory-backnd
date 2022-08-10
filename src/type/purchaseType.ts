import { Types } from 'mongoose';

export interface purchaseType {
    _id: Types.ObjectId,
    supplier_id: Types.ObjectId,
    numbering: string,
    need_Date: Date,
    purchase_By: Types.ObjectId,
    approve_By: Types.ObjectId,
    receive_By: Types.ObjectId,
    storage_Room_Id: Types.ObjectId,
    approve_status: string,
    priority: string,
    status: boolean,
    items: [{
        _id: Types.ObjectId,
        product_Id: Types.ObjectId,
        qty: number,
        unit_Price: number,
        expire_At: Date,
        key: Date,
        product_name: string
    }],
    remark: string,
    created_At: Date
}