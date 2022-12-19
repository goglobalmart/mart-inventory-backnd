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
        // console.log("stocking", to, from)
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
        // console.log(getPurchas);
        const data: any = getPurchas.map((pur) => {
          let obj = {
            _id: pur.product._id,
            date: pur.receive_Date,
            item: pur.product.name,
            unit: pur.product.unit,
            amount: pur.items.qty * pur.items.unit_Price,
            qty: pur.items.qty,
            unit_Price: pur.items.unit_Price,
            vendor: pur.vendor.name,
          };
          return obj;
        });
        const Total_Amount = data
          .map((e: any) => {
            return e.amount;
          })
          .reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue
          );
        const Total_qty = data
          .map((e: any) => {
            return e.qty;
          })
          .reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue
          );
        const Total_unit_Price = data
          .map((e: any) => {
            return e.unit_Price;
          })
          .reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue
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
        const data = getStockOut.map((pur) => {
          let obj = {
            _id: pur.product._id,
            date: pur.delivery_At,
            item: pur.product.name,
            unit: pur.product.unit,
            amount: pur.items.qty * pur.items.unit_Price,
            qty: pur.items.qty,
            unit_Price: pur.items.unit_Price,
            shop: pur.shop.name,
          };
          return obj;
        });
        const Total_Amount = data
          .map((e) => {
            return e.amount;
          })
          .reduce((accumulator, currentValue) => accumulator + currentValue);
        const Total_qty = data
          .map((e) => {
            return e.qty;
          })
          .reduce((accumulator, currentValue) => accumulator + currentValue);
        const Total_unit_Price = data
          .map((e) => {
            return e.unit_Price;
          })
          .reduce((accumulator, currentValue) => accumulator + currentValue);

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
      { product_Id }: { product_Id: string }
    ) => {
      try {
        let queryProduct =
          product_Id.length === 0
            ? {}
            : {
                _id: new mongoose.Types.ObjectId(product_Id),
              };
        const getAllProduct = await Product.find(queryProduct).exec();
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
        const getFinal = getProductsInStockDetail.filter(
          (product: any) => product != undefined
        );
        const total_all_unit_Price = getFinal
          .map((e: any) => {
            return e.stock_Detail[0].unit_Price;
          })
          .reduce( 
            (accumulator: any, currentValue: any) => accumulator + currentValue
          );
        const Total_All_Amount = getFinal
          .map((e: any) => {
            return e.total_Amount;
          })
          .reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue
          );
        const Total_All_Qty = getFinal 
          .map((e: any) => {
            return e.total_Qty;
          })
          .reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue
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
  },
};

export default reportResolver;
