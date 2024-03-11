import { Item } from "../models/item.model.js";

export const createItem = async(req,res) => {
    try {
        const{title,description,tag,totalWeight,originalPrice,discount,image} = req.body;

        if(!title||!description||!tag||!totalWeight||!originalPrice||!discount||!image){
            return res.status(400).json({
                success:false,
                message:"Input field can't be empty"
            })
        }

        const uploadedData = await Item.create({
          title,
          description,
          tag,
          originalPrice,
          discount,
          image,
          totalWeight
        })

        return res.status(200).json({
            success:true,
            message:"image is uploaded",
            uploadedData
        })
    } catch (error) {
        console.log(error)
    }
}

export const getTotalItems = async (req, res) => {
  try {
    const response = await Item.find({});
    return res.status(200).json({
      success: true,
      message: "Every item fetched",
      response,
    });
  } catch (error) {
    console.log(error);
    // Handle the error appropriately, perhaps by sending an error response.
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
