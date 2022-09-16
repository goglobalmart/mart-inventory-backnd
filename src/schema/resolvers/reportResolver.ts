import ProductsInStock from '../../model/ProductsInStock';
import Product from '../../model/Product';
import Purchase from '../../model/Purchase';
import ProductRelease from '../../model/ProductRelease';
import Customer from '../../model/Customer';
import Supplier from '../../model/Supplier';

const reportResolver = {
    Query: {
        getStockInReport: async (_root: undefined, { to, from }: { to: string, from: string }) => {
            try {
                let queryFrom = from.trim().length === 0 ? {} : { receive_Date: { $gte: new Date(from) } }
                let queryTo = to.trim().length === 0 ? {} : { receive_Date: { $lte: new Date(to) } };

                const getPurchas = await Purchase.aggregate([
                    { $match: { status: false } },
                    { $match: { approve_status: "instock" } },
                    { $match: queryFrom },
                    { $match: queryTo },
                    {
                        $unwind: { path: "$items" }
                    },
                    {
                        $lookup: {
                            from: "products",
                            localField: "items.product_Id",
                            foreignField: "_id",
                            as: "product"
                        }
                    },
                    {
                        $unwind: { path: "$product", preserveNullAndEmptyArrays: true }
                    },
                    {
                        $lookup: {
                            from: "suppliers",
                            localField: "supplier_id",
                            foreignField: "_id",
                            as: "vendor"
                        }
                    },
                    {
                        $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true }
                    },
                    { $sort: { receive_Date: 1 } }
                ]);
                const data: any = getPurchas.map(pur => {
                    let obj = {
                        _id: pur._id,
                        date: pur.receive_Date,
                        item: pur.product.name,
                        unit: pur.product.unit,
                        amount: pur.items.qty * pur.items.unit_Price,
                        qty: pur.items.qty,
                        unit_Price: pur.items.unit_Price,
                        vendor: pur.vendor.name
                    }
                    return obj
                })

                return data
            } catch (error) {
                return error
            }
        },
        getStockOutReport: async (_root: undefined, { to, from }: { to: string, from: string }) => {

            try {
                let queryFrom = from.trim().length === 0 ? {} : { delivery_Date: { $gte: new Date(from) } }
                let queryTo = to.trim().length === 0 ? {} : { delivery_Date: { $lte: new Date(to) } };

                const getStockOut = await ProductRelease.aggregate([
                    { $match: { status: false } },
                    { $match: { delivery: true } },
                    { $match: queryFrom },
                    { $match: queryTo },
                    {
                        $unwind: { path: "$items" }
                    },
                    {
                        $lookup: {
                            from: "products",
                            localField: "items.product_Id",
                            foreignField: "_id",
                            as: "product"
                        }
                    },
                    {
                        $unwind: { path: "$product", preserveNullAndEmptyArrays: true }
                    },
                    {
                        $lookup: {
                            from: "customers",
                            localField: "customer_Id",
                            foreignField: "_id",
                            as: "customer"
                        }
                    },
                    {
                        $unwind: { path: "$customer", preserveNullAndEmptyArrays: true }
                    }
                ]);
                const data = getStockOut.map(pur => {
                    let obj = {
                        _id: pur._id,
                        date: pur.delivery_Date,
                        item: pur.product.name,
                        unit: pur.product.unit,
                        amount: pur.items.qty * pur.items.unit_Price,
                        qty: pur.items.qty,
                        unit_Price: pur.items.unit_Price,
                        customer: pur.customer.name
                    }
                    return obj
                })
                return data
            } catch (error) {
                return error
            }
        },
        getStockOnhandReport: async (_root: undefined, { }: {}) => {
            try {
                const getAllProduct = await Product.find().exec();
                const getProductsInStockDetail: any = await Promise.all(getAllProduct.map(async (element: any) => {
                    const getproductInStock = await ProductsInStock.find(
                        {
                            product_Id: element._id,
                            status: false,
                            stock_Status: "instock"
                        }
                    ).exec()
                    const getQtyTotal: any = getproductInStock.map((pro: { qty: any; }) => {
                        return pro.qty
                    })
                    const getAmountTotal: any = getproductInStock.map((pro: { unit_Price: any; qty: any }) => {
                        return pro.unit_Price * pro.qty;
                    })
                    const initialValue = 0;
                    const TotalInsockItemQty = getQtyTotal.reduce(
                        (previousValue: any, currentValue: any) => previousValue + currentValue,
                        initialValue
                    );

                    const TotalInsockItemUnitPrice = getAmountTotal.reduce(
                        (previousValue: any, currentValue: any) => previousValue + currentValue,
                        initialValue
                    );
                    if (getproductInStock.length != 0)
                        return {
                            productName: element.name,
                            unit: element.unit,
                            stock_Detail: getproductInStock,
                            total_Qty: TotalInsockItemQty,
                            total_Amount: TotalInsockItemUnitPrice
                        }
                }))
                // const getFinal = getProductsInStockDetail.filter((product: any) => product != undefined);
                return {
                    message: "Get report Success!",
                    status: true,
                    data: getProductsInStockDetail
                }
            } catch (error) {
                return {
                    message: error,
                    status: false,
                    data: null
                }
            }
        },
        getQtyInHand: async () => {
            const getproductInStock = await ProductsInStock.find(
                {
                    status: false,
                    stock_Status: "instock"
                }
            ).exec();
            let listQty: Array<number> = [];
            getproductInStock.forEach(instock => {
                listQty.push(instock.qty)
            })
            const initialValue = 0;
            const TotalInsockItemUnitPrice = listQty.reduce(
                (previousValue: any, currentValue: any) => previousValue + currentValue,
                initialValue
            );
            return TotalInsockItemUnitPrice;
        },
        getQtyWillReceived: async () => {

            const getSPurchase = await Purchase.aggregate([
                { $match: { status: false } },
                { $match: { approve_status: "approve" } },
            ]);

            const getPur: any = getSPurchase.map(pru => {
                let listQty: Array<number> = [];

                pru.items.forEach((e: any) => listQty.push(e.qty))
                const initialValue = 0;
                const TotalInsockItemUnitPrice = listQty.reduce(
                    (previousValue: any, currentValue: any) => previousValue + currentValue,
                    initialValue
                );
                return TotalInsockItemUnitPrice
            })

            const initialValue = 0;
            const TotalItemsInPuchas = getPur.reduce(
                (previousValue: any, currentValue: any) => previousValue + currentValue,
                initialValue
            );
            return TotalItemsInPuchas
        },
        getTotalUser: async () => {
            const getCustomers = await Customer.find().exec();
            const getSupplier = await Supplier.find().exec();
            return {
                customer: getCustomers.length,
                supplier: getSupplier.length
            }
        },
        getNoItems: async () => {
            const getPro = await Product.find().exec();
            return getPro.length
        },
        getNoPurchase: async () => {
            const getPro = await Purchase.find({ status: false }).exec();
            return getPro.length
        },
        getTotalCost: async () => {
            const getproductInStock = await ProductsInStock.find(
                {
                    status: false,
                    stock_Status: "instock"
                }
            ).exec();
            let listQty: Array<number> = [];
            getproductInStock.forEach(instock => {
                listQty.push(instock.unit_Price)
            })
            const initialValue = 0;
            const TotalInsockItemUnitPrice = listQty.reduce(
                (previousValue: any, currentValue: any) => previousValue + currentValue,
                initialValue
            );
            return TotalInsockItemUnitPrice;
        },
        getTotalCancelOrder: async () => {
            const getPro = await Purchase.find({ status: true }).exec();
            return getPro.length
        },
        getLowStockItems: async () => {
            try {
                const getAllProduct = await Product.find().exec();
                const getProductsInStockDetail: any = await Promise.all(getAllProduct.map(async (element: any) => {
                    const getproductInStock = await ProductsInStock.find(
                        {
                            product_Id: element._id,
                            status: false,
                            stock_Status: "instock"
                        }
                    ).exec()
                    const getQtyTotal: any = getproductInStock.map((pro: { qty: any; }) => {
                        return pro.qty
                    })

                    const initialValue = 0;
                    const TotalInsockItemQty = getQtyTotal.reduce(
                        (previousValue: any, currentValue: any) => previousValue + currentValue,
                        initialValue
                    );

                    return TotalInsockItemQty < 10 ? TotalInsockItemQty : 0
                }))
                return getProductsInStockDetail.length
            } catch (error) {
                return error
            }
        }
    }
}

export default reportResolver