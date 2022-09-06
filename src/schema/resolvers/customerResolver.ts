import customerType from '../../type/customerType';
import Customer from '../../model/Customer';
import authCheck from '../../helpers/auth'
const customer = {
    Query: {
        getAllCustomer: async (_root: undefined, { keyword }: { keyword: string }, { req }: { req: any }) => {
            await authCheck(req.headers.authorization);
            try {
                const get = await Customer.find({ name: { $regex: keyword } }).exec();
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
        createCustomer: async (_root: undefined, { input }: { input: customerType }) => {
            try {
                const isCreate = await new Customer(input).save()
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
        updateCustomer: async (_root: undefined, { customerId, input }: { customerId: customerType, input: customerType }) => {
            try {
                const isUpdate = await Customer.findByIdAndUpdate(customerId, input)
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
        deleteCustomer: async (_root: undefined, { customerId }: { customerId: customerType }) => {
            try {
                const isDelete = await Customer.findByIdAndDelete(customerId)
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

export default customer