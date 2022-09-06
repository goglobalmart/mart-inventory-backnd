import mongoose, { Schema, model } from "mongoose";
import { purchaseType } from '../type/purchaseType';
import paginate from 'mongoose-paginate-v2';

const purchaseSchema = new Schema<purchaseType>({
    _id: { type: Schema.Types.ObjectId },
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    numbering: String,
    need_Date: Date,
    purchase_By: { type: Schema.Types.ObjectId, ref: 'User' },
    approve_By: { type: Schema.Types.ObjectId, ref: 'User' },
    receive_By: { type: Schema.Types.ObjectId, ref: 'User' },
    storage_Room_Id: { type: Schema.Types.ObjectId, ref: 'StorageRoom' },
    approve_status: { type: String, default: "pending" },
    priority: String,
    status: { type: Boolean, default: false },
    items: [{
        product_Id: { type: Schema.Types.ObjectId, ref: 'Product' },
        qty: Number,
        unit_Price: Number,
        key: { type: Date },

    }],
    remark: String,
    receive_Date: Date,
    created_At: { type: Date, default: new Date() }
})

purchaseSchema.plugin(paginate);

const Purchase = model<purchaseType, mongoose.PaginateModel<purchaseType>>('Purchase', purchaseSchema);
export default Purchase;

