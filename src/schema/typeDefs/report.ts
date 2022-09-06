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
        customer: String
   }
    type getReportMessage {
        message: String
        status: Boolean
        data: [StockOnHand]
    }
    type Query {
        getStockOnhandReport: getReportMessage!
        getStockInReport(from: String!, to: String!): [getStockReport!]!
        getStockOutReport(from: String!, to: String!): [getStockReport!]!
    }
`
export default report