import { Schema, model } from "mongoose";
import userType from "../type/userType";

const userShema = new Schema<userType>({
    _id: { type: Schema.Types.ObjectId },
    userName: String,
    firsName: String,
    lastName: String,
    image_name: String,
    image_src: String ,
    email: String,
    phone: String,
    address: String,
    role: String,
    remark: String,
    created_At: { type: Date, default: new Date() },
},
    { _id: false }
)
const models = model<userType>('User', userShema)
export default models