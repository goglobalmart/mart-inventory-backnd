import { Types } from 'mongoose';

interface userType {
  _id: Types.ObjectId,
  firsName: string,
  lastName: string,
  image_name:string,
  image_src:string ,
  email: string,
  password: string,
  role: string,
  created_At: Date
}
export default userType