import { productType } from '../../type/productType';
import Product from '../../model/Product';
import ProductsInStock from '../../model/ProductsInStock';

const productLabels = {
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

const productResolver = {
    Query: {
        getProductsPagination: async (
            _root: undefined,
            { page, limit, keyword, category }: { page: number, limit: number, keyword: string, category: string },
        ) => {
            try {
                const options = {
                    page: page || 1,
                    limit: limit || 10,
                    customLabels: productLabels,
                    sort: {
                        created_At: -1,
                    },
                }
                const query = {
                    $and: [
                        { category: { $regex: category, $options: "i" } },
                        { name: { $regex: keyword, $options: "i" } }
                    ],
                }
                const products = await Product.paginate(query, options);
                return products;
            } catch (error) {
                return error
            }
        },
        getAllProduct: async (_root: undefined, { }) => {
            try {
                const getAll = await Product.find({})
                if (!getAll) {
                    return {
                        message: "Data Not Found!",
                        status: false
                    }
                }
                return getAll
            } catch (error) {
                return {
                    message: error,
                    status: false
                }
            }
        },
        getLessProductInstock: async (_root: undefined, { }) => {
            try {
                const getProduct = await Product.find().exec();

                const getProductStock = await Promise.all(
                    getProduct.map(async (pro: any) => {
                        // console.log(pro)
                        const getStock = await ProductsInStock.find({
                            product_Id: pro._id,
                            stock_Status: "instock",
                            status: false
                        });
                        const getQtyTotal: any = getStock.map((pro: { qty: any; }) => {
                            return pro.qty
                        });
                        const initialValue = 0;
                        const TotalInsockItemQty = getQtyTotal.reduce(
                            (previousValue: any, currentValue: any) => previousValue + currentValue,
                            initialValue
                        );
                        // console.log(TotalInsockItemQty)
                        return {
                            name: pro.name,
                            qty: TotalInsockItemQty,
                            image_src: pro.image_src,
                            unit: pro.unit
                        }
                    })
                )

                // const newData: any = getProductStock.sort((a: any, b: any) => (a.qty < b.qty) ? -1 : 1);


            } catch (error) {
                return error
            }

        }
    },
    Mutation: {
        createProduct: async (_root: undefined, { input }: { input: productType }, { req }: { req: any }) => {
            try {
                const product = await new Product(input).save();
                if (product)
                    return {
                        message: "Product Created!",
                        status: true
                    }
                if (!product)
                    return {
                        message: "Product Cannot Create!",
                        status: false
                    }
            } catch (error) {
                return {
                    message: error,
                    status: false
                }
            }
        },
        updateProduct: async (_root: undefined, { input }: { input: productType }) => {

            try {
                const isUpdate = await Product.findByIdAndUpdate(input.product_Id, input).exec();
                if (!isUpdate) {
                    return {
                        message: "Update Purchase Failse",
                        status: false
                    }
                }
                return {
                    message: "Update Purchase Success",
                    status: true
                }
            } catch (error) {
                return {
                    message: error,
                    status: false
                }
            }
        },
        deleteProduct: async (_root: undefined, { product_Id }: { product_Id: productType }, { req }: { req: any }) => {
            try {
                const isUpdate = await Product.findByIdAndDelete(product_Id)
                if (!isUpdate) {
                    return {
                        message: "Delete Product Failse",
                        status: false
                    }
                }
                return {
                    message: "Delete Product Success",
                    status: true
                }
            } catch (error) {
                return {
                    message: error,
                    status: false
                }
            }
        }
    }
}
export default productResolver;