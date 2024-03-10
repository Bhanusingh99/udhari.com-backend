import { Item } from "../models/item.model.js";

export const createItem = async(req,res) => {
    try {
        const{title,description,tag,totalWeight,originalPrice,discount,image} = req.body;

        console.log(image)
        if(!title||!description||!tag||!totalWeight||!originalPrice||!discount||!image){
            return res.status(400).json({
                success:false,
                message:"Input field can't be empty"
            })
        }

        console.log(title)
        return res.status(200).json({
            success:true,
            message:image
        })
    } catch (error) {
        console.log(error)
    }
}