import { model, Schema } from 'mongoose';
import customerType from '../type/customerType';

const customerSchemar = new Schema<customerType>({
    customerName: String,
    email: String,
    phone: String,
    address: String,
    remark: String,
    created_At: { type: Date, default: new Date() }
})
const Customer = model<customerType>('Customer', customerSchemar);
export default Customer;