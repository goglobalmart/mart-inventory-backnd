import { Schema, model } from "mongoose";
import userType from "../type/userType";

const userShema = new Schema<userType>({
    _id: { type: Schema.Types.ObjectId },
    firsName: String,
    lastName: String,
    image_name: String,
    image_src: String ,
    email: String,
    role: String,
    created_At: { type: Date, default: Date.now }
},
    { _id: false }
)
const User = model<userType>('User', userShema)
export default User