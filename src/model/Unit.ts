import {Schema,model} from 'mongoose'
import unitType from '../type/unitType'

const unit = new  Schema<unitType>({
    name: String,
    created_At: { type: Date, default: new Date() }
})
const Unit = model<unitType>('Unit',unit);
export default Unit