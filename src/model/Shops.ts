import { model, Schema } from 'mongoose';
import shopType from '../type/shopType';

const ShopSchemar = new Schema<shopType>({
    name: String,
    email: String,
    phone: String,
    address: String,
    remark: String,
    created_At: { type: Date, default: new Date() }
})
const Shop = model<shopType>('Shops', ShopSchemar);
export default Shop;