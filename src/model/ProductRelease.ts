import mongoose, { Schema, model } from "mongoose";
import { productReleaseType } from '../type/productReleaseType';
import paginate from 'mongoose-paginate-v2';

const productReleaseSchema = new Schema<productReleaseType>({
    shop_Id: { type: Schema.Types.ObjectId, ref: 'Shops' },
    release_By: { type: Schema.Types.ObjectId, ref: 'User' },
    delivery_By: { type: Schema.Types.ObjectId, ref: 'User' },
    numbering: String,
    status: { type: Boolean, default: false },
    delivery: { type: Boolean, default: false },
    delivery_At: Date,
    time: String,
    // order_Date: Date,
    items: [{
        product_Id: { type: Schema.Types.ObjectId, ref: 'Product' },
        qty: Number,
        unit_Price: Number,
        category: String,
        storage_Room_Id: { type: Schema.Types.ObjectId, ref: 'StorageRoom' },
        storage_Room_name: String,
        key: Date,
        product_name: String
    }],
    stock_Record: [{
        instock_Id: { type: Schema.Types.ObjectId, ref: 'ProductsInStock' },
        qty: { type: Number, default: 0 }
    }],
    remark: String,
    order_Date: Date
})

productReleaseSchema.plugin(paginate);

const ProductRelease = model<productReleaseType, mongoose.PaginateModel<productReleaseType>>('ProductRelease', productReleaseSchema);
export default ProductRelease;



