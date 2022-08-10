import { gql } from 'apollo-server-express';

const purchase = gql`
    type Purchase {
        _id: ID
        supplier_id: Supplier
        numbering: String
        need_Date: DataTime
        remark: String
        storage_Room_Id: StorageRoom 
        purchase_By: User
        receive_By: User
        approve_By: User
        items: [Items]
        approve_status: String
        priority: String
        status: Boolean
        created_At: DataTime
    }
    type Items {
        _id: ID
        product_Id: Product
        qty: Float
        unit_Price: Float
        purchase_Id: Purchase
        key: DataTime
    }
    type purchaseMessage {
        message: String
        status: Boolean
    }
    type getPurchasesPaginationMessage {
        data:[Purchase]
        paginator: Paginator
        message: String
    }

    #  Input Type 
    input createPurchaseInput {
        supplier_id:ID
        priority: String
        need_Date: String
        remark: String
        storage_Room_Id: String 
        items: [itemsInput]
    }
    input updatePurchaseInput {
        supplier_id:ID
        priority: String
        purchase_By: ID
        receive_By: ID
        approve_By: ID
        need_Date: String
        remark: String
        storage_Room_Id: String 
        items: [reveiveItemsInput]
    }
    input itemsInput {
        product_Id: String
        qty: Float
        unit_Price: Float
        key: DataTime
    }
    input recievePurchaseInput {
        _id: String
        remark: String
        storage_Room_Id: String 
        items: [reveiveItemsInput]
    }
    input reveiveItemsInput {
        product_Id: String
        qty: Float
        unit_Price: Float
        expire_At: String
        key: DataTime
        product_name: String 
    }
    type Query {
        getPurchasingPaginatioin(page: Int!, limit: Int!,keyword: String!, storage_Room_Id: String!, approve_status: String!, priority: String! ): getPurchasesPaginationMessage!
    }
    type Mutation {
        createPurchase(input: createPurchaseInput!): purchaseMessage!
        updatePurchase(purchase_Id: String!, input: updatePurchaseInput!): purchaseMessage!
        approvePurchasing(purchase_Id: String, status: String!): purchaseMessage!
        voidingPurchas(purchase_Id: String): purchaseMessage!
        receivePuchaseingProduct(input: recievePurchaseInput!): purchaseMessage! 
    }
`

export default purchase;

