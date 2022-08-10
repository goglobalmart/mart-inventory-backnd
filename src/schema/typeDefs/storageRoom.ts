import { gql } from "apollo-server-express";
const storageRoom = gql`
    scalar DataTime
    type Query{
        getStorageRoom(keyword: String!): [ StorageRoom! ]
    }
    type Mutation{
        createStorageRoom(input: StorageRoomInput!): StorageRoomMessage!
        updateStorageRoom(StorageRoomId:ID,input: StorageRoomInput): StorageRoomMessage!
        deleteStorageRoom(StorageRoomId:ID!): StorageRoomMessage!
    }
    type StorageRoom {
        _id: ID
        name: String,
        place: String,
        remark: String,
        created_At: DataTime
    }
    input StorageRoomInput{
        name: String,
        place: String,
        remark: String,
    }
    type StorageRoomMessage{
        status: Boolean
        message: String 
    }
`;
export default storageRoom