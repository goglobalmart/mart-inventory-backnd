import ProductsInStock from "../../model/ProductsInStock";
import Product from "../../model/Product";
import Purchase from "../../model/Purchase";
import ProductRelease from "../../model/ProductRelease";
import Shops from "../../model/Shops";
import Supplier from "../../model/Supplier";
import mongoose from "mongoose";


const reportResolver = {
    Query: {
        getStockInReport: async (
            _root: undefined,
            { product_Id, to, from }: { product_Id: string; to: string; from: string }
        ) => {
            try {
                let queryFrom =
                    from.trim().length === 0
                        ? {}
                        : { receive_Date: { $gte: new Date(from) } };
                let queryTo =
                    to.trim().length === 0
                        ? {}
                        : { receive_Date: { $lte: new Date(to) } };
                let queryProduct =
                    product_Id.length === 0
                        ? {}
                        : { "items.product_Id": new mongoose.Types.ObjectId(product_Id) };
                const getPurchas = await Purchase.aggregate([
                    { $match: { status: false } },
                    { $match: { approve_status: "instock" } },
                    { $match: queryFrom },
                    { $match: queryTo },
                    {
                        $unwind: { path: "$items" },
                    },
                    {
                        $match: queryProduct,
                    },
                    {
                        $lookup: {
                            from: "products",
                            localField: "items.product_Id",
                            foreignField: "_id",
                            as: "product",
                        },
                    },
                    {
                        $unwind: { path: "$product", preserveNullAndEmptyArrays: true },
                    },
                    {
                        $lookup: {
                            from: "suppliers",
                            localField: "supplier_id",
                            foreignField: "_id",
                            as: "vendor",
                        },
                    },
                    {
                        $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true },
                    },
                    { $sort: { receive_Date: 1 } },
                ]);

                let amountArraye: Array<number> = [];
                let qtyArraye: Array<number> = [];
                let unitPriceArraye: Array<number> = [];
                const data: any = getPurchas.map((pur) => {
                    amountArraye.push(pur.items.qty * pur.items.unit_Price)
                    qtyArraye.push(pur.items.qty)
                    unitPriceArraye.push(pur.items.unit_Price)
                    let obj = {
                        _id: pur._id,
                        date: pur.receive_Date,
                        product_id: pur.product._id,
                        item: pur.product.name,
                        unit: pur.product.unit,
                        amount: pur.items.qty * pur.items.unit_Price,
                        qty: pur.items.qty,
                        unit_Price: pur.items.unit_Price,
                        vendor: pur.vendor.name,
                    };
                    return obj;
                });

                const initialValue = 0;
                const Total_Amount = amountArraye.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );
                const Total_qty = qtyArraye.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );

                const Total_unit_Price = unitPriceArraye.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );


                return {
                    data: data,
                    total_unit_price: Total_unit_Price,
                    total_amount: Total_Amount,
                    total_qty: Total_qty,
                };
            } catch (error) {
                return error;
            }
        },
        getStockOutReport: async (
            _root: undefined,
            { product_Id, to, from }: { product_Id: string; to: string; from: string }
        ) => {
            try {
                let queryFrom =
                    from.trim().length === 0
                        ? {}
                        : { delivery_At: { $gte: new Date(from) } };
                let queryTo =
                    to.trim().length === 0 ? {} : { delivery_At: { $lte: new Date(to) } };
                let queryProduct =
                    product_Id.length === 0
                        ? {}
                        : { "items.product_Id": new mongoose.Types.ObjectId(product_Id) };
                const getStockOut = await ProductRelease.aggregate([
                    { $match: { status: false } },
                    { $match: { delivery: true } },
                    { $match: queryFrom },
                    { $match: queryTo },
                    {
                        $unwind: { path: "$items" },
                    },
                    {
                        $match: queryProduct,
                    },
                    {
                        $lookup: {
                            from: "products",
                            localField: "items.product_Id",
                            foreignField: "_id",
                            as: "product",
                        },
                    },
                    {
                        $unwind: { path: "$product", preserveNullAndEmptyArrays: true },
                    },
                    {
                        $lookup: {
                            from: "shops",
                            localField: "shop_Id",
                            foreignField: "_id",
                            as: "shop",
                        },
                    },
                    {
                        $unwind: { path: "$shop", preserveNullAndEmptyArrays: true },
                    },
                ]);

                let amountArraye: Array<number> = [];
                let qtyArraye: Array<number> = [];
                let unitPriceArraye: Array<number> = [];

                const data = getStockOut.map((pur) => {
                    amountArraye.push(pur.items.qty * pur.items.unit_Price)
                    qtyArraye.push(pur.items.qty)
                    unitPriceArraye.push(pur.items.unit_Price)
                    let obj = {
                        _id: pur.product._id,
                        releaseCard_id: pur._id,
                        date: pur.delivery_At,
                        item: pur.product.name,
                        product_id: pur.product._id,
                        unit: pur.product.unit,
                        amount: pur.items.qty * pur.items.unit_Price,
                        qty: pur.items.qty,
                        unit_Price: pur.items.unit_Price,
                        shop: pur.shop.name,
                    };
                    return obj;
                });
                const initialValue = 0;
                const Total_Amount = amountArraye.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );
                const Total_qty = qtyArraye.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );

                const Total_unit_Price = unitPriceArraye.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );
                return {
                    data: data,
                    total_unit_price: Total_unit_Price,
                    total_amount: Total_Amount,
                    total_qty: Total_qty,
                };
            } catch (error) {
                return error;
            }
        },
        getStockOnhandReport: async (
            _root: undefined,
            { product_Id, to, from }: { product_Id: string; to: string; from: string }
        ) => {
            try {
                let queryProduct =
                    product_Id.length === 0
                        ? {}
                        : {
                            _id: new mongoose.Types.ObjectId(product_Id),
                        };
                let queryFrom =
                    from.trim().length === 0
                        ? {}
                        : { instock_At: { $gte: new Date(from) } };
                let queryTo =
                    to.trim().length === 0
                        ? {}
                        : { instock_At: { $lte: new Date(to) } };

                const getAllProduct = await Product.find(queryProduct).exec();



                const getProductsInStockDetail: any = await Promise.all(
                    getAllProduct.map(async (element: any) => {
                        const getproductInStock = await ProductsInStock.find({
                            $and: [
                                { product_Id: element._id },
                                { status: false },
                                { stock_Status: "instock" },
                                queryTo,
                                queryFrom
                            ]
                        }).exec();

                        // console.log(getproductInStock);
                        const getQtyTotal: any = getproductInStock.map(
                            (pro: { qty: any }) => {
                                return pro.qty;
                            }
                        );
                        const getAmountTotal: any = getproductInStock.map(
                            (pro: { unit_Price: any; qty: any }) => {
                                return pro.unit_Price * pro.qty;
                            }
                        );
                        const initialValue = 0;
                        const TotalInsockItemQty = getQtyTotal.reduce(
                            (previousValue: any, currentValue: any) =>
                                previousValue + currentValue,
                            initialValue
                        );

                        const TotalInsockItemUnitPrice = getAmountTotal.reduce(
                            (previousValue: any, currentValue: any) =>
                                previousValue + currentValue,
                            initialValue
                        );
                        if (getproductInStock.length != 0)
                            return {
                                productName: element.name,
                                unit: element.unit,
                                stock_Detail: getproductInStock,
                                total_Qty: TotalInsockItemQty,
                                total_Amount: TotalInsockItemUnitPrice,
                            };
                    })
                );

                let amountArraye: Array<number> = [];
                let qtyArraye: Array<number> = [];
                let unitPriceArraye: Array<number> = [];

                const getFinal = getProductsInStockDetail.filter(
                    (product: any) => product != undefined
                );
                getFinal.forEach((element: any) => {
                    amountArraye.push(element.total_Amount)
                    qtyArraye.push(element.total_Qty)
                    unitPriceArraye.push(element.stock_Detail[0].unit_Price)
                });

                const initialValue = 0;
                const Total_All_Amount = amountArraye.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );
                const Total_All_Qty = qtyArraye.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );

                const total_all_unit_Price = unitPriceArraye.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );

                return {
                    message: "Get report Success!",
                    status: true,
                    total_All_Amount: Total_All_Amount,
                    total_All_Qty: Total_All_Qty,
                    total_all_unit_Price: total_all_unit_Price,
                    data: getFinal,
                };
            } catch (error) {
                return {
                    message: error,
                    status: false,
                    data: null,
                };
            }
        },
        getQtyInHand: async () => {
            const getproductInStock = await ProductsInStock.find({
                status: false,
                stock_Status: "instock",
            }).exec();
            let listQty: Array<number> = [];
            getproductInStock.forEach((instock) => {
                listQty.push(instock.qty);
            });
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

            const getPur: any = getSPurchase.map((pru) => {
                let listQty: Array<number> = [];

                pru.items.forEach((e: any) => listQty.push(e.qty));
                const initialValue = 0;
                const TotalInsockItemUnitPrice = listQty.reduce(
                    (previousValue: any, currentValue: any) =>
                        previousValue + currentValue,
                    initialValue
                );
                return TotalInsockItemUnitPrice;
            });

            const initialValue = 0;
            const TotalItemsInPuchas = getPur.reduce(
                (previousValue: any, currentValue: any) => previousValue + currentValue,
                initialValue
            );
            return TotalItemsInPuchas;
        },
        getTotalUser: async () => {
            const getShops = await Shops.find().exec();
            const getSupplier = await Supplier.find().exec();
            return {
                shop: getShops.length,
                supplier: getSupplier.length,
            };
        },
        getNoItems: async () => {
            const getPro = await Product.find().exec();
            return getPro.length;
        },
        getNoPurchase: async () => {
            const getPro = await Purchase.find({ status: false }).exec();
            return getPro.length;
        },
        getTotalCost: async () => {
            const getproductInStock = await ProductsInStock.find({
                status: false,
                stock_Status: "instock",
            }).exec();
            let listQty: Array<number> = [];
            getproductInStock.forEach((instock) => {
                listQty.push(instock.unit_Price);
            });
            const initialValue = 0;
            const TotalInsockItemUnitPrice = listQty.reduce(
                (previousValue: any, currentValue: any) => previousValue + currentValue,
                initialValue
            );
            return TotalInsockItemUnitPrice;
        },
        getTotalCancelOrder: async () => {
            const getPro = await Purchase.find({ status: true }).exec();
            return getPro.length;
        },
        getLowStockItems: async () => {
            try {
                const getAllProduct = await Product.find().exec();
                const getProductsInStockDetail: any = await Promise.all(
                    getAllProduct.map(async (element: any) => {
                        const getproductInStock = await ProductsInStock.find({
                            product_Id: element._id,
                            status: false,
                            stock_Status: "instock",
                        }).exec();
                        const getQtyTotal: any = getproductInStock.map(
                            (pro: { qty: any }) => {
                                return pro.qty;
                            }
                        );

                        const initialValue = 0;
                        const TotalInsockItemQty = getQtyTotal.reduce(
                            (previousValue: any, currentValue: any) =>
                                previousValue + currentValue,
                            initialValue
                        );

                        return TotalInsockItemQty < 10 ? TotalInsockItemQty : 0;
                    })
                );
                return getProductsInStockDetail.length;
            } catch (error) {
                return error;
            }
        },
        getSummaryStock: async (
            _root: undefined,
            { to, from }: { to: string; from: string }
        ) => {
            try {
                let categories: Array<string> = ["Food", "Meat", "Drink", "Vegetables", "Fruit", "Cosmetic", "Snacks", "Spices", "Soap", "Ice Cream", "Preserved Food", "Other"];

                const getStockOutFrom = from.trim().length === 0 ? {}
                    : { delivery_At: { $gte: new Date(from) } };
                const getStockOutTo =
                    to.trim().length === 0
                        ? {}
                        : { delivery_At: { $lte: new Date(to) } };

                const getPurchaseFrom = from.trim().length === 0 ? {}
                    : { receive_Date: { $gte: new Date(from) } };
                const getPurchaseTo =
                    to.trim().length === 0
                        ? {}
                        : { receive_Date: { $lte: new Date(to) } };

                const getOnHandFrom = from.trim().length === 0 ? {}
                    : { instock_At: { $gte: new Date(from) } };
                const getOnHandTo =
                    to.trim().length === 0
                        ? {}
                        : { instock_At: { $lte: new Date(to) } };

                const gerRes: any = await Promise.all(
                    categories.map(async (category: string) => {

                        // get stockout report 
                        let getRelease = await ProductRelease.aggregate([
                            { $match: { status: false } },
                            {
                                $match: {
                                    delivery: true
                                }
                            },
                            { $match: getStockOutFrom },
                            { $match: getStockOutTo },
                            { $unwind: { path: "$items" } },
                            { $match: { "items.category": category } },
                        ]);
                        let unit_Prices: Array<number> = [];

                        getRelease.forEach((release: any) => {
                            unit_Prices.push(release.items.unit_Price)
                        })

                        const initialValue = 0;
                        const total_Unit_Prices = unit_Prices.reduce(
                            (accumulator, currentValue) => accumulator + currentValue,
                            initialValue
                        );

                        // get stocin report 
                        let unit_Purchase: Array<number> = [];
                        const getPurchas = await Purchase.aggregate([
                            { $match: { status: false } },
                            { $match: { approve_status: "instock" } },
                            { $match: getPurchaseFrom },
                            { $match: getPurchaseTo },
                            {
                                $unwind: { path: "$items" },
                            },
                            { $match: { "items.category": category } },

                        ]);
                        getPurchas.forEach((pur: any) => {
                            unit_Purchase.push(pur.items.unit_Price)
                        })
                        const total_unit_Purchas = unit_Purchase.reduce(
                            (accumulator, currentValue) => accumulator + currentValue,
                            initialValue
                        );

                        // get onhand report 
                        let getProductsOnHand = await ProductsInStock.aggregate(
                            [
                                { $match: { status: false } },
                                { $match: { stock_Status: "instock" } },
                                { $match: getOnHandFrom },
                                { $match: getOnHandTo },
                                {
                                    $lookup: {
                                        from: "products",
                                        localField: "product_Id",
                                        foreignField: "_id",
                                        as: "product"
                                    }
                                },
                                { $unwind: { path: "$product" } },
                                { $match: { "product.category": category } },
                            ]
                        );
                        let unit_PricesInStock: Array<number> = [];

                        getProductsOnHand.forEach((InStock: any) => {
                            unit_PricesInStock.push(InStock.unit_Price)
                        })
                        const total_unit_PricesInStock = unit_PricesInStock.reduce(
                            (accumulator, currentValue) => accumulator + currentValue,
                            initialValue
                        );

                        let report: any = {
                            category: category,
                            purchasing: total_unit_Purchas,
                            issues: total_Unit_Prices,
                            ending: total_unit_PricesInStock
                        }
                        return report
                    }))

                return gerRes
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        adjustStockin: async (
            _root: undefined,
            { _id, product_Id, qty, unit_Price }: { _id: String; product_Id: String; qty: Number; unit_Price: Number; }) => {
            try {
                const updatestocking = await Purchase.updateOne(
                    {
                        _id,
                        "items.product_Id": product_Id
                    }
                    , {
                        "$set": {
                            "items.$.qty": qty,
                            "items.$.unit_Price": unit_Price
                        }
                    },
                )
                if (updatestocking) {
                    await ProductsInStock.findOneAndUpdate({
                        purchase_Id: _id,
                        product_Id: product_Id
                    }, {
                        qty: qty,
                        unit_Price: unit_Price,
                    });
                    return {
                        message: "Success!",
                        status: true
                    }
                } else {
                    return {
                        message: "Not Success!",
                        status: false
                    }
                }

            } catch (error) {
                return error;
            }
        },
        adjustStockout: async (
            _root: undefined,
            { _id, product_Id, qty, unit_Price }: { _id: String; product_Id: String; qty: Number; unit_Price: Number; }) => {
            try {
                const updatestockout = await ProductRelease.updateOne(
                    {
                        _id,
                        "items.product_Id": product_Id
                    }
                    , {
                        "$set": {
                            "items.$.qty": qty,
                            "items.$.unit_Price": unit_Price
                        }
                    },
                )
                if (updatestockout) {
                    return {
                        message: "Success!",
                        status: true
                    }
                } else {
                    return {
                        message: "Not Success!",
                        status: false
                    }
                }

            } catch (error) {
                return error;
            }
        }
    }
};

export default reportResolver;
