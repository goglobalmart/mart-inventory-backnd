import { gql } from 'apollo-server-express'

const report = gql`
    type OnHand {
        product: Product
        qty: Float
        unit_Price: Float
        amount: Float
       reciev_Date: DataTime
       expire_At:DataTime
    }
    
    type getReportMessage {
        message: String
        status: Boolean
        data: [OnHand]
    }
    type Query {
        getStockOnHand: getReportMessage!
    }
`
export default report