import { gql } from "apollo-server-express";

const users = gql`
        #type
        type User {
            _id:ID
            firsName: String
            lastName: String  
            image_name: String
            image_src: String
            email: String
            role: String
            created_At: DataTime
        }
        type UserMessage{
            message: String 
            status: Boolean
        }
        #Input Type
        input UserInput{
            firsName: String
            lastName: String 
            image_name: String
            image_src: String
            email: String
            password: String
            role: String
        }
        input UserUpdate{
            firsName: String
            lastName: String 
            image_name: String
            image_src: String 
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