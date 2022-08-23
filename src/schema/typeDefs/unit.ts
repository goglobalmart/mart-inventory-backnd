import {gql} from 'apollo-server-express'
const unit = gql ` 
        type Unit {
            _id: ID
            name: String 
            created_At: DataTime
        } 
        input UnitInput {
            name: String 
        }
        type UnitMessage {
            status: Boolean
            message: String
        }
        type Query{
            getUnit: [ Unit! ]
            getUnitFindBykeyword(keyword:String!): [ Unit! ]
        }
        type Mutation{ 
            createUnit(input: UnitInput! ):  UnitMessage!
            updateUnit(unitId: ID! ,input: UnitInput! ): UnitMessage!
            deleteUnit(unitId: ID ): UnitMessage!
        }
`;
export default unit 
