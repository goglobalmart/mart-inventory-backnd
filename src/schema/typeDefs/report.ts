import { gql } from 'apollo-server-express'

const report = gql`
    type OnHand {
        stock_Name: String
        items: [ReportItem]
    }
    type ReportItem{
        product_Name: String
        product_Catagory: String
        qty: Float
        purchas_Date: DataTime
    }
    type getReportMessage {
        message: String
        status: Boolean
        data: [OnHand]
    }
    type Query {
        getProductOnHandReport: getReportMessage!
    }
`
export default report