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
        created_At: DataTime
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
        unit: String
    }
    type Query {
        getAllProduct: [ Product! ]
        getProductsPagination( page: Int!,limit: Int!, keyword: String!, category: String! ): getProductsPaginationMessage!
    }
    type Mutation {
        createProduct(input: createProductInput!): productMessage!
        updateProduct(input: updateProductInput!): productMessage!
        deleteProduct(product_Id: String!): productMessage!

    }
`
export default product