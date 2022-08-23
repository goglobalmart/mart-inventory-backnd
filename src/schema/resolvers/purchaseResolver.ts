import Purchase from '../../model/Purchase';
import { purchaseType } from '../../type/purchaseType';
import ProductsInStock from '../../model/ProductsInStock';
import mongoose, { Types } from "mongoose";
import { numberingGenerator } from '../../util/fn';
import authCheck from '../../helpers/auth'
const purchaseLabels = {
    docs: "data",
    limit: "perPage",
    nextPage: "next",
    prevPage: "prev",
    meta: "paginator",
    page: "currentPage",
    pagingCounter: "slNo",
    totalDocs: "totalDocs",
    totalPages: "totalPages",
};

const purchase = {
    Query: {
        getPurchasingPaginatioin: async (
            _root: undefined, { page, limit, keyword, storage_Room_Id, approve_status, priority }:
                { page: number, limit: number, keyword: string, storage_Room_Id: string, approve_status: string, priority: string }) => {
            try {
                const options = {
                    page: page || 1,
                    limit: limit || 10,
                    customLabels: purchaseLabels,
                    sort: {
                        created_At: -1,
                    },
                    populate: "storage_Room_Id purchase_By receive_By approve_By supplier_id items.product_Id",

                }
                if (storage_Room_Id === "") {
                    let query = {
                        $and: [
                            { numbering: { $regex: keyword, $options: "i" } },
                            { priority: { $regex: priority, $options: "i" } },
                            { approve_status: { $regex: approve_status, $options: "i" } },
                        ],
                    }

                    const purchase = await Purchase.paginate(query, options);
                    return purchase
                } else {
                    let query = {
                        $and: [
                            { numbering: { $regex: keyword, $options: "i" } },
                            { storage_Room_Id: new mongoose.Types.ObjectId(storage_Room_Id) },
                            { priority: { $regex: priority, $options: "i" } },
                            { approve_status: { $regex: approve_status, $options: "i" } },
                        ],
                    }

                    const purchase = await Purchase.paginate(query, options);
                    return purchase
                }

            } catch (error) {
                return error
            }
        }
    },
    Mutation: {
        createPurchase: async (_root: undefined, { input }: { input: purchaseType }, { req }: { req: any }) => {
            const currentUser = await authCheck(req.headers.authorization);
            let newArray: {
                product_Id: Types.ObjectId,
                qty: number,
                unit_Price: number,
                storage_Room_Id: Types.ObjectId
            }[] = [];
            try {
                const getPurchas = await Purchase.find().exec();
                const numbering = await numberingGenerator(getPurchas?.length + 1);
                const purchase = await new Purchase({
                    ...input,
                    _id: new mongoose.Types.ObjectId(),
                    numbering,
                    purchase_By: new mongoose.Types.ObjectId(currentUser.uid)
                }).save();

                if (purchase) {
                    input.items.forEach(element => {
                        const finalResult = Object.assign(
                            element,
                            {
                                storage_Room_Id: input.storage_Room_Id,
                                purchase_Id: purchase._id,
                                product_Id: element.product_Id
                            }
                        );
                        newArray.push(finalResult);
                    });
                    await ProductsInStock.insertMany(newArray)
                    return {
                        message: "Purchase Created!",
                        status: true,
                        data: purchase
                    }
                }
            } catch (error) {
                return {
                    message: error,
                    status: false,
                    data: null
                }
            }
        },
        updatePurchase: async (_root: undefined, { purchase_Id, input }: { purchase_Id: string, input: purchaseType }) => {
            try {
                let newArray: {
                    product_Id: Types.ObjectId,
                    qty: number,
                    unit_Price: number,
                    storage_Room_Id: Types.ObjectId
                }[] = [];

                const purchase = await Purchase.findByIdAndUpdate(purchase_Id, input).exec();
                if (purchase) {

                    purchase.items.forEach(async item => {
                        await ProductsInStock.findByIdAndDelete(item._id).exec();
                    });

                    input.items.forEach(element => {
                        const finalResult = Object.assign(
                            element,
                            {
                                storage_Room_Id: input.storage_Room_Id,
                                purchase_Id: purchase._id,
                                product_Id: element.product_Id
                            }
                        );
                        newArray.push(finalResult);
                    });
                    await ProductsInStock.insertMany(newArray);
                    return {
                        message: "Purchase Updated!",
                        status: true,
                        data: purchase
                    }
                } else {
                    return {
                        message: "Purchase Updated not success!",
                        status: false,
                        data: null
                    }
                }
            } catch (error) {
                return error;
            }
        },
        approvePurchasing: async (_root: undefined, { purchase_Id, status }: { purchase_Id: string, status: string }, { req }: { req: any }) => {
            const currentUser = await authCheck(req.headers.authorization);

            try {
                const purchase = await Purchase.findByIdAndUpdate(
                    purchase_Id,
                    {
                        approve_status: status,
                        approve_By: new mongoose.Types.ObjectId(currentUser.uid)
                    }
                ).exec();
                if (purchase) {
                    await ProductsInStock.updateMany(
                        {
                            purchase_Id
                        },
                        {
                            $set: { stock_Status: status }
                        }
                    );
                    return {
                        message: `Purchase ${status}!`,
                        status: true,
                        data: purchase
                    }
                }
            } catch (error) {
                return {
                    message: error,
                    status: false,
                    data: null
                }
            }
        },
        voidingPurchas: async (_root: undefined, { purchase_Id }: { purchase_Id: string, status: string }) => {
            // console.log(purchase_Id)
            try {
                const purchase = await Purchase.findByIdAndUpdate(purchase_Id, { status: true }).exec();
                if (purchase) {
                    await ProductsInStock.updateMany(
                        {
                            purchase_Id
                        },
                        {
                            $set: { status: true }
                        }
                    );
                    return {
                        message: `Purchase voided!`,
                        status: true,
                        data: purchase
                    }
                }
            } catch (error) {
                return {
                    message: error,
                    status: false,
                    data: null
                }
            }
        },
        receivePuchaseingProduct: async (_root: undefined, { input }: { input: purchaseType }, { req }: { req: any }) => {
            const currentUser = await authCheck(req.headers.authorization);
            // console.log("Reciev : ", input.items)
            try {
                const getReceivePuchas = await Purchase.findByIdAndUpdate(input._id, {
                    ...input,
                    approve_status: "instock",
                    receive_By: new mongoose.Types.ObjectId(currentUser.uid)
                }).exec();
                // console.log(getReceivePuchas)
                if (getReceivePuchas) {
                    input.items.forEach(async item => {
                        // console.log(item)
                        await ProductsInStock.updateMany(
                            { purchase_Id: input._id, product_Id: item.product_Id },
                            {
                                product_Id: item.product_Id,
                                stock_Status: "instock",
                                created_At: new Date(),
                                expire_At: item.expire_At,
                                unit_Price: item.unit_Price,
                                qty: item.qty
                            }
                        );

                    })
                    return {
                        message: "Purchase Received!",
                        status: true,
                        data: getReceivePuchas
                    }
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

export default purchase;

