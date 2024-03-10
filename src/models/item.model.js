import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
    title:{
        type:String,
        required:[true,"title is required"]
    },
    description:{
        type:String,
        required:[true,"description is required"]
    },
    tag:{
        type:String,
        required:[true,"tag is required"]
    },
    totalWeight:{
        type:String,
        required:[true,"items weight or liter is required"]
    },
    originalPrice:{
        type:Number,
        required:[true,"original price is required"]
    },
    discount:{
        type:Number,
        required:[true,"discount is required"]
    },
    stock:{
        type:Boolean,
        default:true
    },
    image:{
        type:String,
        required:[true,"image is required"]
    }
})

export const Item = mongoose.model("items",itemSchema);