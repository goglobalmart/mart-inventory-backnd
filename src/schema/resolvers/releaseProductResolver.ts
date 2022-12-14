import ProductRelease from '../../model/ProductRelease';
import { productReleaseType } from '../../type/productReleaseType';
import { ProductFifoCheck } from '../../util/fn';
import { numberingGenerator, CheckStock } from '../../util/fn';
import ProductsInStock from '../../model/ProductsInStock';
import mongoose from 'mongoose';
import moment from 'moment-timezone';
import Product from '../../model/Product';

const releaseProductLabels = {
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

const releaseCard = {
    Query: {
        getReleaseProductPagination: async (_root: undefined, { page, limit, keyword, shop_Id, delivery_Id, delivery_At }: { page: number, limit: number, keyword: string, shop_Id: string, delivery_Id: string, delivery_At: string }) => {
            try {
                const options = {
                    page: page || 1,
                    limit: limit || 10,
                    customLabels: releaseProductLabels,
                    sort: {
                        numbering: -1,
                    },
                    populate: "items.storage_Room_Id release_By shop_Id delivery_By items.product_Id",
                }
                let queryShopId = shop_Id === "" ? {} : { shop_Id: new mongoose.Types.ObjectId(shop_Id) };
                let queryDeliveryId = delivery_Id === "" ? {} : { delivery_By: new mongoose.Types.ObjectId(delivery_Id) }
                let queryDeliveryDate = delivery_At === "" ? {} : { delivery_At: new Date(delivery_At) };
                // console.log(queryDeliveryDate);
                const query = {
                    $and: [
                        { numbering: { $regex: keyword, $options: "i" } },
                        queryShopId,
                        queryDeliveryId,
                        queryDeliveryDate
                    ],
                }
                const productRelease = await ProductRelease.paginate(query, options);
                return productRelease

            } catch (error) {
                return error
            }
        }
    },
    Mutation: {
        createReleaseCard: async (_root: undefined, { input }: { input: productReleaseType }) => {
            try {
                let today = new Date(input.delivery_At);
                let year = today.getFullYear();
                let month = today.getMonth() + 1;
                let dt = today.getDate();
                let newDay: string = dt < 10 ? '0' + String(dt) : String(dt);
                let newMonth: string = month < 10 ? '0' + String(month) : String(month);
                let delivery_At = year + '-' + newMonth + '-' + newDay

                const time = moment(input.delivery_At).tz('Asia/Phnom_Penh').format("HH:mm A");
                const getReleaseLength = await ProductRelease.find().exec();
                const numbering = await numberingGenerator(getReleaseLength?.length + 1);
                const newItems = await Promise.all(
                    input.items.map(async (item: any) => {
                        let getProduct = await Product.findById(item.product_Id);
                        const obj2 = Object.assign(item, { category: getProduct?.category });
                        return obj2
                    })
                )
                const releasProdut = new ProductRelease(
                    {
                        ...input,
                        items: newItems,
                        numbering,
                        time,
                        delivery_At,
                        order_Date: new Date(input.order_Date)
                    }
                )
                await releasProdut.save();
                await releasProdut.populate('shop_Id release_By delivery_By items.product_Id')

                if (releasProdut) {
                    return {
                        message: "Release Producte Createed!",
                        status: true,
                        data: releasProdut
                    }
                } else {
                    return {
                        message: "Cannot Create!",
                        status: false,
                        data: null
                    }
                }
            } catch (error: any) {
                return {
                    message: error.message + "",
                    status: false,
                    data: null
                }
            }
        },
        delivered: async (_root: undefined, { release_Card_Id, input }: { release_Card_Id: string, input: productReleaseType }) => {

            try {
                let today = new Date();
                let year = today.getFullYear();
                let month = today.getMonth() + 1;
                let dt = today.getDate();
                let newDay: string = dt < 10 ? '0' + String(dt) : String(dt);
                let newMonth: string = month < 10 ? '0' + String(month) : String(month);

                const checkMessage = await new CheckStock();
                const checkProductInstock = await checkMessage.stockNotEnough(input.items);
                if (checkProductInstock.status)
                    return {
                        message: checkProductInstock?.message,
                        status: false,
                        data: null
                    }

                const getFifoCheck = input.items.map(item => {
                    const fifo = new ProductFifoCheck(item.qty, item.product_Id.toString(), item.storage_Room_Id.toString(), release_Card_Id.toString());
                    const res = fifo.calculate();
                    return res
                })
                const newItems = await Promise.all(
                    input.items.map(async (item: any) => {
                        let getProduct = await Product.findById(item.product_Id);
                        const obj2 = Object.assign(item, { category: getProduct?.category });
                        return obj2
                    })
                )
                if (getFifoCheck) {
                    let releas = await ProductRelease.findByIdAndUpdate(release_Card_Id, {
                        ...input,
                        items: newItems,
                        delivery: true,
                        delivery_At: year + '-' + newMonth + '-' + newDay,
                        time: moment().tz('Asia/Phnom_Penh').format("HH:mm A")
                    }).populate('shop_Id release_By delivery_By items.product_Id').exec();

                    return {
                        message: "delivered",
                        status: true,
                        data: releas
                    }
                }


            } catch (error) {
                return error
            }
        },
        updateReleaseCard: async (_root: undefined, { input }: { input: productReleaseType }) => {
            try {
                let today = new Date(input.delivery_At);
                let year = today.getFullYear();
                let month = today.getMonth() + 1;
                let dt = today.getDate();
                let newDay: string = dt < 10 ? '0' + String(dt) : String(dt);
                let newMonth: string = month < 10 ? '0' + String(month) : String(month);
                let delivery_At = year + '-' + newMonth + '-' + newDay
                const time = moment(input.delivery_At).tz('Asia/Phnom_Penh').format("HH:mm");

                const newItems = await Promise.all(
                    input.items.map(async (item: any) => {
                        let getProduct = await Product.findById(item.product_Id);
                        const obj2 = Object.assign(item, { category: getProduct?.category });
                        return obj2
                    })
                )
                const updateReleaseCard = await ProductRelease.findByIdAndUpdate(input.release_Card_Id, {
                    ...input,
                    items: newItems,
                    time,
                    delivery_At,
                    order_Date: new Date(input.order_Date)
                }).populate('shop_Id release_By delivery_By items.product_Id').exec();

                if (updateReleaseCard) {
                    return {
                        message: "Update Success!",
                        status: true,
                        data: updateReleaseCard
                    }
                } else {
                    return {
                        message: "Cannot update!",
                        status: false,
                        data: null
                    }
                }
            } catch (error) {
                return {
                    message: error,
                    data: null,
                    status: false
                }
            }
        },
        voidingReleaseCard: async (_root: undefined, { release_Card_Id }: { release_Card_Id: string }) => {
            try {
                const findReleasCard = await ProductRelease.findById(release_Card_Id).exec();
                // console.log(findReleasCard)
                findReleasCard?.stock_Record.forEach(async (element: any) => {
                    const getStockout: any = await ProductsInStock.findById(element.instock_Id).exec();
                    // const getSotkc = validateToken(getStockout.stock_Out ?? 0)
                    // console.log("ProductsInStock.stock_Out", getStockout.stock_Out - element?.qty)
                    await ProductsInStock.findByIdAndUpdate(
                        element.instock_Id,
                        {
                            qty: getStockout?.qty + element?.qty,
                            stock_Status: "instock",
                            stock_Out: getStockout.stock_Out - element?.qty
                        }
                    ).exec();
                });
                const release = await ProductRelease.findByIdAndUpdate(
                    release_Card_Id,
                    {
                        status: true
                    }
                ).exec();

                return {
                    message: "Void Success!",
                    status: true,
                    data: release
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

export default releaseCard;