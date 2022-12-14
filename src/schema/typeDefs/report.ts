import { gql } from 'apollo-server-express';

const report = gql`
    type StockOnHand {
        productName: String
        unit: String
        stock_Detail: [Stock_Detail]
        total_Qty: Float
        total_Amount: Float
    }
    type Stock_Detail {
       qty: Float
       unit_Price: Float
    }
   type getStockReport {
        _id: ID
        date: DataTime
        item: String
        unit: String
        qty: Float
        unit_Price: Float
        amount: Float
        vendor: String
        shop: String
   }
    type getReportMessage {
        message: String
        status: Boolean
        data: [StockOnHand]
    }
    type TotalUserMessage {
        shop: Float
        supplier: Float
    }
    type Query {
        getStockOnhandReport(product_Id: String!): getReportMessage!
        getStockInReport(product_Id: String!,from: String!, to: String!): [getStockReport!]!
        getStockOutReport(product_Id: String!,from: String!, to: String!): [getStockReport!]!
        getQtyInHand: Float!
        getQtyWillReceived: Float!
        getTotalUser: TotalUserMessage!
        getLowStockItems: Float!
        getNoItems: Float!
        getNoPurchase: Float!
        getTotalCost: Float!
        getTotalCancelOrder: Float!
    }
`
export default report