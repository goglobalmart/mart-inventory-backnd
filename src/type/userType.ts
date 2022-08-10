import { Types } from 'mongoose';

interface userType {
  _id: Types.ObjectId,
  userName: string,
  firsName: string,
  lastName: string,
  image_name:string,
  image_src:string ,
  email: string,
  password: string,
  phone: string,
  address: string,
  role: string,
  remark: string
  created_At: Date,
}
export default userType