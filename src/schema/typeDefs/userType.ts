import { gql } from "apollo-server-express";

const users = gql`
        #type
        type User {
            _id:ID
            userName: String
            firsName: String
            lastName: String  
            image_name: String
            image_src: String
            email: String
            phone: String
            address: String
            role: String
            remark: String
            created_At: DataTime
        }
        type UserMessage{
            message: String 
            status: Boolean
        }
        #Input Type
        input UserInput{
            userName: String
            firsName: String
            lastName: String 
            image_name: String
            image_src: String
            email: String
            password: String
            phone: String
            address: String
            role: String
            remark: String
        }
        input UserUpdate{
           # user_id: ID
            userName: String
            firsName: String
            lastName: String 
            image_name: String
            image_src: String 
            #email: String
            phone: String
            address: String
            role: String
            remark: String
        }
        type Query{
            getAllUser: [User]
            getUserLogin: User
        }
        type Mutation{
            createUser(input: UserInput!): UserMessage!
            updateUser(user_Id: ID, input: UserUpdate): UserMessage
            deleteUser(user_id: ID!): UserMessage!

        } 
`;
export default users