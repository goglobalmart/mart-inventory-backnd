import Unit from '../../model/Unit';
import unitType from '../../type/unitType';
const unitResolver = {
    Query:{
        getUnit:async(_root:undefined,{})=>{
            try {
                const getAll = await Unit.find({})
                return getAll
            } catch (error) {
                return{
                    status: false,
                    message:error
                }
            }
        },
              
    },
    Mutation:{
        createUnit:async(_root:undefined,{input}:{input:unitType})=>{
            try {
                const isCreate = await new Unit(input).save();
                if(!isCreate){
                    return {
                        status:false,
                        message:"Create Unit Failse"
                    }
                }
                return {
                    status: true,
                    message:"Create Unit Success"
                }
            } catch (error) {
                return{
                    status: false,
                    message:error
                }
            }
        },
        updateUnit:async(_root:undefined,{unitId,input}:{unitId:unitType,input:unitType})=>{
            try {
                const isUpdate = await  Unit.findByIdAndUpdate(unitId,input)
                if(!isUpdate){
                    return {
                        status:false,
                        message:"Update Unit Failse"
                    }
                }
                return {
                    status: true,
                    message:"Update Unit Success"
                }
            } catch (error) {
                return{
                    status: false,
                    message:error
                }
            }
        },
        deleteUnit:async(_root:undefined,{unitId }:{unitId:unitType})=>{
            try {
                const isUpdate = await  Unit.findByIdAndDelete(unitId)
                if(!isUpdate){
                    return {
                        status:false,
                        message:"Delete Unit Failse"
                    }
                }
                return {
                    status: true,
                    message:"Delete Unit Success"
                }
            } catch (error) {
                return{
                    status: false,
                    message:error
                }
            }
        }

    }
}
export default unitResolver