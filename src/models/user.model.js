import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    firstname:{
        type:String,
        requires:[true,"firstname must is required"]
    },
    lastname:{
        type:String,
        requires:[true,"lastname must is required"]
    },
    username:{
        type:String,
        requires:[true,"username must is required"]
    },
    email:{
        type:String,
        requires:[true,"email must is required"]
    },
    password:{
        type:String,
        requires:[true,"password must is required"]
    },
})

export const User = mongoose.model("user",userSchema);