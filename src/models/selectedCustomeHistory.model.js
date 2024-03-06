import mongoose,{Schema} from "mongoose";

const selectedCustomerHistorySchema = new Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:"Customer"
    },
    transactionHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Customer"
        }
    ]
})

export const selectedCustomerHistory = mongoose.model("selected_user_history",selectedCustomerHistorySchema);