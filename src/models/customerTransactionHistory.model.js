import mongoose,{Schema} from "mongoose";

const CustomerTrasactionHistorySchema = new Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:"Customer"
    },
    totalTrasaction:[
        {
            money:{
                type:Number,
                required:true
            },
            description:{
                type:String
            },
            transactionType:{
                type:String,
                enum:["CASH","CREDIT"],
                required:true
            },
            createdAt:{
                type:Date,
                default:Date.now
            }
        }
    ]
})

export const customerHistory = mongoose.model("selected_customer_history",CustomerTrasactionHistorySchema);