import ProductsInStock from '../../model/ProductsInStock';
import StorageRoom from '../../model/StorageRoom'
import { productOnhandReportType } from '../../type/reportType';
import { productInstockType, productType } from "../../type/productType";
import { getProductOnHandReportClass } from '../../util/fn'
const reportResolver = {
    Query: {
        getStockOnHand: async (_root: undefined, { }: {}) => {
            try {
                let newArray: {
                    product: any,
                    qty: number,
                    unit_Price: number,
                    amount: number,
                    reciev_Date: Date,
                    expire_At: Date
                }[] = [];
                const getOnhand = await ProductsInStock.find({
                    stock_Status: "instock",
                    status: false
                }).populate({
                    path: 'product_Id',
                    select:
                        'name',
                });
                getOnhand.forEach(element => {
                    console.log(element)
                    newArray.push({
                        product: element.product_Id,
                        qty: element.qty,
                        unit_Price: element.unit_Price,
                        amount: element.qty * element.unit_Price,
                        reciev_Date: element.created_At,
                        expire_At: element.expire_At
                    });
                    // console.log("in foreach",newArray)
                })
                if (getOnhand)
                    return {
                        message: "Run Report Success!",
                        status: true,
                        data: newArray
                    }
                // console.log(newArray)
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