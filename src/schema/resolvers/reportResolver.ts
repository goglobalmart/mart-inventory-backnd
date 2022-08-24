import ProductsInStock from '../../model/ProductsInStock';
import StorageRoom from '../../model/StorageRoom'
import { productOnhandReportType } from '../../type/reportType';
import { productInstockType, productType } from "../../type/productType";
import { getProductOnHandReportClass } from '../../util/fn'
const reportResolver = {
    Query: {
        getProductOnHandReport: async (_root: undefined, { }: {}) => {

            try {
                const getReport = new getProductOnHandReportClass();
                getReport.getMessage()
                // const getStorageRoom = await StorageRoom.find().exec();
                // if (!getStorageRoom) {
                //     return {
                //         message: "No Storage Room",
                //         status: false,
                //         data: null
                //     }
                // }
                // getStorageRoom.forEach(async element => {
                //     const getProduct = await ProductsInStock.find({
                //         storage_Room_Id: element._id,
                //         status: false,
                //         stock_Status: "instock"
                //     }).populate<{ product_Id: productType }>('product_Id');
                //     // console.log(getProduct)
                //     if (getProduct.length > 0) {
                //         // console.log(getProduct)
                //         productReport.push(getProduct)
                //     }



                // })
                // console.log(productReport)
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