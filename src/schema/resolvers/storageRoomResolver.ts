import StorageRoom from '../../model/StorageRoom'
import { storageRoomType } from '../../type/storageRoomType';
const storageRoomResolver = {
    Query: {
        getStorageRoom: async (_root: undefined, { keyword }: { keyword: string }) => {
            try {
                const getStorageRoom = await StorageRoom.find({ name: { $regex: keyword } }).exec();
                return getStorageRoom
            } catch (error) {
                return {
                    message: error,
                    status: false
                }
            }
        }
    },
    Mutation: {
        createStorageRoom: async (_root: undefined, { input }: { input: storageRoomType }) => {
            try {
                const isCreate = await new StorageRoom(input).save()
                if (!isCreate) {
                    return {
                        message: "Create Storage Room Failse ",
                        status: false
                    }
                }
                return {
                    message: "create success ",
                    status: true
                }
            } catch (error) {
                return {
                    message: error,
                    status: false
                }
            }
        },
        updateStorageRoom: async (_root: undefined, { StorageRoomId, input }: { StorageRoomId: storageRoomType, input: storageRoomType }) => {
            try {
                const isUpdate = await StorageRoom.findByIdAndUpdate(StorageRoomId, input)
                if (!isUpdate) {
                    return {
                        message: "Update Storage Room failse",
                        status: false
                    }
                }
                return {
                    message: "Storage Room Updated",
                    status: true
                }
            } catch (error) {
                return {
                    message: error,
                    status: false
                }
            }
        },
        deleteStorageRoom: async (_root: undefined, { StorageRoomId }: { StorageRoomId: storageRoomType }) => {
            try {
                const isDelete = await StorageRoom.findByIdAndDelete(StorageRoomId)
                if (!isDelete) {
                    return {
                        message: "Delete storage room failse",
                        status: false
                    }
                }
                return {
                    message: "Delete Storage Room Success",
                    status: true
                }
            } catch (error) {
                return {
                    message: error,
                    status: false
                }
            }
        }
    }
}

export default storageRoomResolver