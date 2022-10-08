import shopType from '../../type/shopType';
import Shop from '../../model/Shops';
import authCheck from '../../helpers/auth'
const Shops = {
    Query: {
        getAllShops: async (_root: undefined, { keyword }: { keyword: string }, { req }: { req: any }) => {
            await authCheck(req.headers.authorization);
            try {
                const get = await Shop.find({ name: { $regex: keyword, $options: "i" } }).exec();
                return get
            } catch (error) {
                return {
                    message: error,
                    status: false,
                    data: null
                }
            }
        }
    },
    Mutation: {
        createShop: async (_root: undefined, { input }: { input: shopType }) => {
            try {
                const isCreate = await new Shop(input).save()
                if (!isCreate) {
                    return {
                        message: "create failse",
                        status: false,
                    }
                }
                return {
                    message: "created",
                    status: true
                }
            } catch (error) {
                return {
                    message: error,
                    status: false,
                    data: null
                }
            }
        },
        updateShop: async (_root: undefined, { shopId, input }: { shopId: shopType, input: shopType }) => {
            try {
                const isUpdate = await Shop.findByIdAndUpdate(shopId, input)
                if (!isUpdate) {
                    return {
                        message: "Update failse",
                        status: false,
                    }
                }
                return {
                    message: "Updated",
                    status: true
                }
            } catch (error) {
                return {
                    message: error,
                    status: false,
                    data: null
                }
            }
        },
        deleteShop: async (_root: undefined, { shopId }: { shopId: shopType }) => {
            try {
                const isDelete = await Shop.findByIdAndDelete(shopId)
                if (!isDelete) {
                    return {
                        message: "delete failse",
                        status: false,
                    }
                }
                return {
                    message: "deleted",
                    status: true
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

export default Shops