import { supplierType } from '../../type/supplierType';
import Supplier from '../../model/Supplier';

const supplier = {
    Query: {
        getSuppliers: async (_root: undefined, { keyword }: { keyword: string }) => {
            try { 
                const suppliers = await Supplier.find({ name: { $regex: keyword } }).sort({ created_At: -1 }).exec();
                if (suppliers)
                    return {
                        message: "Get Spplier Success!",
                        status: true,
                        data: suppliers
                    }
                    return suppliers
            } catch (error) {
                return {
                    message: error,
                    status: false,
                    data: null
                }
            }
        } 
    },
    Mutation: {
        createdSupplier: async (_root: undefined, { input }: { input: supplierType }, { req }: { req: any }) => {
            try {
                const supplier = await new Supplier(input).save();
                if (supplier)
                    return {
                        message: "Suppllier Created!",
                        status: true
                    }
                if (!supplier)
                    return {
                        message: "Create Supplier not Success!",
                        status: false
                    }
            } catch (error) {
                return {
                    message: error,
                    status: false
                }
            }
        },
        updateSupplier: async (_root:undefined,{supplerId,input}:{supplerId:supplierType,input:supplierType}, { req }: { req: any })=>{
            try {
                 const isUpdate = await Supplier.findByIdAndUpdate(supplerId,input)
                 if(!isUpdate){
                    return{
                        message:" Update Supplier failse ",
                        status:false
                    }
                 }
                 return{
                    message:"Supplier Updated",
                    status:true
                }
            } catch (error) {
                return {
                    message: error,
                    status: false
                }
            }
        },
        deleteSupplier: async (_root:undefined,{supplerId }:{supplerId:supplierType }, { req }: { req: any })=>{
            try {
                 const isDelete = await Supplier.findByIdAndDelete(supplerId)
                 if(!isDelete){
                    return{
                        message:" Delete Supplier failse ",
                        status:false
                    }
                 }
                 return{
                    message:"Supplier Delete",
                    status:true
                }
            } catch (error) {
                return {
                    message: error,
                    status: false
                }
            }
        },
    }
};

export default supplier;