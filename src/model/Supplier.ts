import { model, Schema } from 'mongoose';
import { supplierType } from '../type/supplierType';

const supplierSchema = new Schema<supplierType>({
    name: { type: String, required: true },
    tel: String,
    email: String,
    adress: String,
    remark: String,
    created_At: { type: Date, default: new Date() }
});
const Supplier = model<supplierType>('Supplier', supplierSchema );
export default Supplier;
