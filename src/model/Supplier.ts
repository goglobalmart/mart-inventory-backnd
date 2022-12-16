 
import { supplierType } from '../type/supplierType';
import paginate from "mongoose-paginate-v2";
import mongoose, { Schema, model } from "mongoose";


const supplierSchema = new Schema<supplierType>({
    name: { type: String, required: true },
    tel: String,
    email: String,
    adress: String,
    remark: String,
    facebook: String,
    image_Src: String,
    image_Name: String,
    created_At: { type: Date, default: Date.now }
});

supplierSchema.plugin(paginate);
const Supplier = model<supplierType, mongoose.PaginateModel<supplierType>>("Supplier", supplierSchema); 
export default Supplier;
