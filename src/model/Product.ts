import mongoose, { model, Schema } from 'mongoose';
import { productType } from '../type/productType';
import paginate from 'mongoose-paginate-v2';

const productSchema = new Schema<productType>({
    name: { type: String, required: true },
    cost: Number,
    category: String,
    image_src: String,
    remark: String,
    type: String,
    feature: String,
    unit: String,
    bar_Code: String,
    created_At: { type: Date, default: Date.now }
})

productSchema.plugin(paginate);

const Product = model<productType, mongoose.PaginateModel<productType>>('Product', productSchema);
export default Product;
