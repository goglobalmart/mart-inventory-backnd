import { gql } from 'apollo-server-express'
const customer = gql` 
        scalar DataTime 
        type Query{
            getAllCustomer(keyword: String!): [Customer!]
        }
        type Mutation{
            createCustomer( input: CustomerInput!): customerMessage!
            updateCustomer( customerId: ID,input: CustomerInput): customerMessage!
            deleteCustomer( customerId: ID): customerMessage!
        }
        type customerMessage {
            status: Boolean
            message: String
        }
        type Customer {
            _id:ID
            name: String 
            email: String
            phone: String 
            address: String 
            remark: String
            created_At: DataTime
        }
        input CustomerInput{
            name: String 
            email: String
            phone: String 
            address: String 
            remark: String
        }
    `;
export default customer