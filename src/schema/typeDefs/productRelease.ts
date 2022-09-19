import { gql } from 'apollo-server-express';

const productRelease = gql`
    type RroductRelease {
        _id: ID
        customer_Id: Customer
        delivery: Boolean
        status: Boolean
        release_By: User
        delivery_By: User
        numbering: String
        delivery_At: DataTime 
        time: String
        remark: String
        items: [Items]
        order_Date: DataTime 
    }
    type releaseMesage {
        message: String
        status: Boolean
        data: RroductRelease
    }
    type getReleaseProductPaginationMessage {
        data:[RroductRelease]
        paginator: Paginator
        message: String
    }
    # Input Type 
    input createReleaseCardInput {
        customer_Id: String
        delivery_By: String
        release_By: String
        delivery_At: DataTime
        order_Date: String
        remark: String
        items: [ releasItemsInput!]
    }
    input updateReleaseCardInput {
        release_Card_Id: String
        customer_Id: String
        delivery_By: String
        release_By: String
        delivery_At: DataTime
        order_Date: String
        remark: String
        items: [ releasItemsInput!]
    }
    input releasItemsInput {
        product_Id: String
        qty: Float
        unit_Price: Float
        storage_Room_Id: String
        storage_Room_name: String
        product_name: String
        key: DataTime
    }
    # getReleaseProductPagination
    type Query {
        getReleaseProductPagination(page: Int!, limit: Int!,keyword: String!, customer_Id: String!, delivery_Id: String!, delivery_At: String!  ): getReleaseProductPaginationMessage!
    }
    type Mutation {
        createReleaseCard( input: createReleaseCardInput! ): releaseMesage!
        updateReleaseCard(input: updateReleaseCardInput!): releaseMesage!
        voidingReleaseCard(release_Card_Id: String!): releaseMesage!
        delivered(release_Card_Id: String!,input: createReleaseCardInput!): releaseMesage!
    }
`
export default productRelease;