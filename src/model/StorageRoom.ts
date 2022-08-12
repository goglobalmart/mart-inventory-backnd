import { Schema, model } from 'mongoose'
import { storageRoomType } from '../type/storageRoomType';
const storageRoom = new Schema<storageRoomType>({
    name: String,
    place: String,
    remark: String,
    created_At: { type: Date, default: new Date() }
})
const StorageRoom = model<storageRoomType>('StorageRoom', storageRoom )
export default StorageRoom