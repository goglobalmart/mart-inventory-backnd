import { gql } from 'apollo-server-express'
const shop = gql` 
        scalar DataTime 
        type Query{
            getAllShops(keyword: String!): [Shop!]
        }
        type Mutation{
            createShop( input: ShopInput!): shopMessage!
            updateShop( shopId: ID,input: ShopInput): shopMessage!
            deleteShop( shopId: ID): shopMessage!
        }
        type shopMessage {
            status: Boolean
            message: String
        }
        type Shop {
            _id:ID
            name: String 
            email: String
            phone: String 
            address: String 
            remark: String
            created_At: DataTime
        }
        input ShopInput{
            name: String 
            email: String
            phone: String 
            address: String 
            remark: String
        }
    `;
export default shop