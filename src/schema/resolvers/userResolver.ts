import userType from '../../type/userType';
import User from '../../model/User';
import app from '../../config/firebaceConfig'
import mongoose from 'mongoose';
import authCheck from '../../helpers/auth'

const userResolver = {
    Query: {
        getAllUser: async (_root: undefined, { }) => {
            try {
                const getAll = await User.find({})
                return getAll
            } catch (error) {
                return {
                    status: false,
                    message: error
                }
            }
        },
        getUserLogin: async (_root: undefined, { }, { req }: { req: any }) => {

            const currentUser = await authCheck(req.headers.authorization);
            // console.log("toke currentUser :",currentUser)
            try {
                const user = await User.findById(currentUser.uid).exec();
                return user
            } catch (error) {
                return {
                    status: false,
                    message: error
                }
            }
        }
    },
    Mutation: {
        createUser: async (_root: undefined, { input }: { input: userType }, { req }: { req: any }) => {

            try {
                const _id = new mongoose.Types.ObjectId();
                const user = await new User({
                    ...input,
                    _id
                }).save()
                if (user) {
                    app.auth().createUser(
                        {
                            email: input.email,
                            password: input.password,
                            uid: _id.toString()
                        }
                    ).catch((error) => {
                        console.log(error)
                    })
                }
                if (!user) {
                    return {
                        status: false,
                        message: "Create User failse"
                    }
                }
                return {
                    status: true,
                    message: "Create User Success"
                }
            } catch (error) {
                return {
                    status: false,
                    message: error

                }
            }
        },
        updateUser: async (_root: undefined, { user_Id, input }: { user_Id: userType, input: userType }, { req }: { req: any }) => {
            try {
                const isUpdate = await User.findByIdAndUpdate(user_Id, input)
                if (!isUpdate) {
                    return {
                        status: false,
                        message: " Update User Failse"
                    }
                }
                return {
                    status: true,
                    message: "Update User Success"
                }
            } catch (error) {
                return {
                    status: false,
                    message: error
                }
            }
        },
        deleteUser: async (_root: undefined, { user_id }: { user_id: userType }, { req }: { req: any }) => {
            // console.log(user_id)
            try {
                const isDelete = await User.findByIdAndDelete(user_id).exec()
                if (isDelete) {
                    const userID = user_id.toString();
                    app.auth().deleteUser(userID)
                        .then(() => {
                            console.log('Successfully deleted user');
                        })
                        .catch((error) => {
                            console.log('Error deleting user:', error);
                        });
                }
                if (!isDelete) {
                    return {
                        status: false,
                        message: "Delete User Failse"
                    }
                }
                return {
                    status: true,
                    message: "Delete User Succcess"
                }
            } catch (error) {
                return {
                    status: false,
                    message: error

                }
            }
        }
    }
}
export default userResolver; 
