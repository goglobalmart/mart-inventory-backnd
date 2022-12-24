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
        product_id: ID
        releaseCard_id: ID
        date: DataTime
        item: String
        unit: String
        qty: Float
        unit_Price: Float
        amount: Float
        vendor: String
        shop: String
   }
   type GetStockReport{
    data: [getStockReport!]!
    total_unit_price: Float
    total_amount: Float
    total_qty: Float
   }
    type getReportMessage {
        message: String
        status: Boolean
        total_All_Amount: Float
        total_All_Qty: Float
        total_all_unit_Price: Float
        data: [StockOnHand]
    }
    type TotalUserMessage {
        shop: Float
        supplier: Float
    }
    type getSummaryStockReportMessage {
        category: String
        purchasing: Float
        issues: Float
        ending: Float 
    }
    type Query {
        getStockOnhandReport(product_Id: String!): getReportMessage!
        getStockInReport(product_Id: String!,from: String!, to: String!): GetStockReport
        getStockOutReport(product_Id: String!,from: String!, to: String!): GetStockReport
        getSummaryStock(from: String!, to: String!): [getSummaryStockReportMessage!]!
        getQtyInHand: Float!
        getQtyWillReceived: Float!
        getTotalUser: TotalUserMessage!
        getLowStockItems: Float!
        getNoItems: Float!
        getNoPurchase: Float!
        getTotalCost: Float!
        getTotalCancelOrder: Float!
    }
    type Mutation {
        adjustStockin(_id: String!, product_Id: String!, qty: Float!, unit_Price: Float! ): productMessage!
        adjustStockout(_id: String!, product_Id: String!, qty: Float!, unit_Price: Float! ): productMessage!
    }
`
export default report