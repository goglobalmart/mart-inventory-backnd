import ProductsInStock from '../../model/ProductsInStock';
import Product from '../../model/Product';
import Purchase from '../../model/Purchase';
import ProductRelease from '../../model/ProductRelease';

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
        },
        getStockReport: async (_root: undefined, { }: {}) => {
            try {


                const getAllProduct = await Product.find().exec();

                const producStock = await Promise.all(getAllProduct.map(async (element: any) => {
                    const getReleaseProduct = await ProductRelease.aggregate([
                        // { $match: { status: false } },
                        { $match: { delivery: false } },
                        // { $unwind: "$items" },
                        // { $match: { 'items.product_Id': element._id } },
                        // {
                        //     $lookup:
                        //     {
                        //         from: "storagerooms",
                        //         localField: "storage_Room_Id",
                        //         foreignField: "_id",
                        //         as: "storage_Room"
                        //     }
                        // }
                    ]);
                    console.log(getReleaseProduct)
                    const getProduct = await Purchase.aggregate([
                        { $match: { approve_status: 'instock' } },
                        { $match: { status: false } },
                        { $unwind: "$items" },
                        { $match: { 'items.product_Id': element._id } },
                        {
                            $lookup:
                            {
                                from: "storagerooms",
                                localField: "storage_Room_Id",
                                foreignField: "_id",
                                as: "storage_Room"
                            }
                        },
                        {
                            $lookup:
                            {
                                from: "users",
                                localField: "receive_By",
                                foreignField: "_id",
                                as: "receive_By"
                            }
                        },
                        { $unwind: "$receive_By" },
                        { $unwind: "$storage_Room" }
                    ]);
                    const getFinalProduct = getProduct.map(pro => {
                        const xValua: number = pro.items.qty * pro.items.unit_Price;
                        const valuaOje = {
                            valua: xValua
                        }
                        const newVal = {
                            ...valuaOje,
                            ...pro.items
                        }
                        const finalVal = {
                            item: newVal
                        }
                        const finalRes = {
                            ...pro,
                            ...finalVal
                        }
                        // console.log(finalRes)
                        return finalRes
                    })
                    if (getFinalProduct.length != 0)
                        return {
                            productName: element.name,
                            stock_Detail: getFinalProduct
                        }

                }))
                const getFinal = producStock.filter(product => product != undefined);
                return {
                    message: "Get report Success!",
                    status: true,
                    data: getFinal
                }
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