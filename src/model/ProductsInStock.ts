import mongoose, { Schema, model } from "mongoose";
import { productInstockType } from "../type/productType";
import paginate from 'mongoose-paginate-v2';

const productsInStockSchema = new Schema<productInstockType>({
    product_Id: { type: Schema.Types.ObjectId, ref: 'Product' },
    qty: Number,
    stock_Out: Number,
    unit_Price: Number,
    status: { type: Boolean, default: false },
    stock_Status: { type: String, default: "pending" },
    created_At: Date,
    storage_Room_Id: { type: Schema.Types.ObjectId, ref: 'StorageRoom' },
    purchase_Id: { type: Schema.Types.ObjectId, ref: 'Purchase' },
    instock_At: Date,
    expire_At: Date
})
productsInStockSchema.plugin(paginate);
const ProductsInStock = model<productInstockType, mongoose.PaginateModel<productInstockType>>('ProductsInStock', productsInStockSchema);
export default ProductsInStock;