import { gql } from 'apollo-server-express'

const report = gql`
    type OnHand {
        product: Product
        qty: Float
        unit_Price: Float
        amount: Float
       reciev_Date: DataTime
       expire_At: DataTime
    }
    type Report {
        productName: String
        stock_Detail: [Stock_Detail]
    }
    type Stock_Detail {
      _id: ID
      numbering: String
    #   supplier_id: new ObjectId("62fddc31561c40251cd2e62d"),
      need_Date: DataTime
    #   purchase_By: new ObjectId("62fc5dde561c40251cd2dee7"),
      storage_Room: StorageRoom
      approve_status: String
      priority: DataTime
      status: Boolean
      remark: String
      created_At: DataTime
    #   approve_By: new ObjectId("62fc5dde561c40251cd2dee7"),
      receive_By: User
      item:Items
    }
   
    type getReportMessage {
        message: String
        status: Boolean
        data: [Report]
    }
    type Query {
        getStockOnHand: getReportMessage!
        getStockReport: getReportMessage!
    }
`
export default report