import { gql } from 'apollo-server-express';

const product = gql`
    scalar DataTime
    type Product {
        _id: ID
        name: String
        cost: Float
        category: String
        image_src: String
        remark: String
        type: String
        feature: String
        unit: String
        bar_Code: String
        created_At: DataTime
    }
    type InstoctProduct {
        product_Id: Product
        qty: Float
        unit_Price: Float
        storage_Room_Id: StorageRoom
        purchase_Id: Purchase
        expire_At: DataTime
        instock_At: DataTime
 
        stock_Out: Float, 
        status: Boolean
        stock_Status: String
        created_At: DataTime
    }
    type LessProductInStcok {
        name: String
        qty: Float
        image_src: String
        unit: String
    }
    type productMessage {
        message: String
        status: Boolean
    }
    type getProductsPaginationMessage {
        paginator: Paginator!
        message: String
        data: [Product!]
    } 
    type getProductsInStockPaginationMessage {
        paginator: Paginator!
        message: String
        data: [InstoctProduct!]
    } 
    type Paginator { 
        slNo: Int
        prev: Int
        next: Int
        perPage: Int
        totalPosts: Int
        totalPages: Int
        currentPage: Int
        hasPrevPage: Boolean
        hasNextPage: Boolean
        totalDocs:Int
    }
    # Input Type 
    input createProductInput {
        name: String
        cost: Float
        category: String
        image_src: String
        remark: String
        type: String
        feature: String
        bar_Code: String
        unit: String
    }
    input updateProductInput {
        product_Id: String
        name: String
        cost: Float
        category: String
        image_src: String
        remark: String
        type: String
        feature: String
        bar_Code: String
        unit: String
    }
    type Query {
        getAllProduct: [ Product! ]
        getProductsPagination( page: Int!,limit: Int!, keyword: String!, category: String! ): getProductsPaginationMessage!
        getLessProductInstock: [LessProductInStcok!]! 
        getExpireProducts( page: Int!,limit: Int!, keyword: String! ,status: String! ): getProductsInStockPaginationMessage!
    }
    type Mutation {
        createProduct(input: createProductInput!): productMessage!
        updateProduct(input: updateProductInput!): productMessage!
        deleteProduct(product_Id: String!): productMessage!
    }
`
export default product