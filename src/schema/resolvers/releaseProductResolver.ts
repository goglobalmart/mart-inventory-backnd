import mongoose from 'mongoose';
import Product from '../../model/Product';
import ProductRelease from '../../model/ProductRelease';
import ProductsInStock from '../../model/ProductsInStock'
import { productReleaseType } from '../../type/productReleaseType';
import { ReleaseProductMessage } from '../../util/fn';
import authCheck from '../../helpers/auth';
import { numberingGenerator } from '../../util/fn';

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
        getReleaseProductPagination: async (_root: undefined, { page, limit, keyword }: { page: number, limit: number, keyword: string }) => {
            try {
                const options = {
                    page: page || 1,
                    limit: limit || 10,
                    customLabels: releaseProductLabels,
                    sort: {
                        created_At: -1,
                    },
                    populate: "items.storage_Room_Id release_By customer_Id delivery_By items.product_Id",

                }

                const query = {
                    $and: [
                        { numbering: { $regex: keyword, $options: "i" } },
                        // { priority: { $regex: priority, $options: "i" } },
                        // { approve_status: { $regex: approve_status, $options: "i" } },
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
                // console.log(input)
                const getReleaseLength = await ProductRelease.find().exec();
                const numbering = await numberingGenerator(getReleaseLength?.length + 1);

                const releasProdut = await new ProductRelease(
                    {
                        ...input,
                        numbering,
                        // release_By:
                    }
                ).save();
                releasProdut.populate('customer_Id release_By delivery_By items.product_Id');
                if (releasProdut) {
                    return {
                        message: "Release Producte Createed!",
                        status: true
                    }
                } else {
                    return {
                        message: "Cannot Create!",
                        status: false
                    }
                }
            } catch (error: any) {
                return {
                    message: error.message + "",
                    status: false
                }
            }
        },
        delivered: async (_root: undefined, { release_Card_Id, input }: { release_Card_Id: string, input: productReleaseType }) => {
            // const getReleaseProducts = await ProductRelease.findById(release_Card_Id).exec();
            const getMess = new ReleaseProductMessage(input?.items);
            const messageCheck = await getMess.getMessage();
            if (messageCheck === "Release Product Created!") {
                await ProductRelease.findByIdAndUpdate(release_Card_Id, { delivery: true, items: input.items }).exec();
                return {
                    message: messageCheck,
                    status: true
                }
            } else {
                return {
                    message: messageCheck,
                    status: false
                }
            }
        },
        updateReleaseCard: async (_root: undefined, { input }: { input: productReleaseType }) => {
            try {
                const updateReleaseCard = await ProductRelease.findByIdAndUpdate(input.release_Card_Id, input).populate('customer_Id release_By delivery_By items.product_Id').exec();
                if (updateReleaseCard) {
                    return {
                        message: "Update Success!",
                        status: true
                    }
                } else {
                    return {
                        message: "Cannot update!",
                        status: false
                    }
                }
            } catch (error) {

            }
        },
        voidingReleaseCard: async (_root: undefined, { release_Card_Id }: { release_Card_Id: string }) => {
            try {

            } catch (error) {

            }
        }
    }
}

export default releaseCard;