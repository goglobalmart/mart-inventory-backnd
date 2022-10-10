import { model, Schema } from 'mongoose';
import { supplierType } from '../type/supplierType';

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
const Supplier = model<supplierType>('Supplier', supplierSchema);
export default Supplier;
