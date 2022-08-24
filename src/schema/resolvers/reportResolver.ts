import ProductsInStock from '../../model/ProductsInStock';
import StorageRoom from '../../model/StorageRoom'
import { productOnhandReportType } from '../../type/reportType';
import { productInstockType } from "../../type/productType";

const reportResolver = {
    Query: {
        getProductOnHandReport: async (_root: undefined, { }: {}) => {
            let productReport: Array<productOnhandReportType>;
            try {
                const getStorageRoom = await StorageRoom.find().exec();
                if (!getStorageRoom) {
                    return {
                        message: "No Storage Room",
                        status: false,
                        data: null
                    }
                }
                // getStorageRoom.forEach(async element => {
                //     const getProduct = await ProductsInStock.find({
                //         storage_Room_Id: element._id,
                //         status: false,
                //         stock_Status: "instock"
                //     }).populate('product_Id storage_Room_Id').exec();
                //     // console.log(getProduct)
                //     if (getProduct.length > 0)
                //         getProduct.forEach(pro => console.log(pro.product_Id.name))
                //     if (item.user instanceof User) {
                //         console.log(item.user.name);
                //     } else {
                //         // Otherwise, it is a Types.ObjectId
                //     }
                // })
            } catch (error) {
                return {
                    message: error,
                    status: false,
                    data: null
                }
            }
        }
    }
}

export default reportResolver