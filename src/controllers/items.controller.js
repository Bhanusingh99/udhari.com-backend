import { Item } from "../models/item.model.js";

export const createItem = async(req,res) => {
    try {
        const{title,description,tag,totalWeight,originalPrice,discount,image,userId} = req.body;

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
          totalWeight,
          userId
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


export const getIndividualItems = async (req, res) => {
  try {
    const { userId } = req.body;

    const foundItem = await Item.find( {userId} );

    return res.status(200).json({
      success: true,
      message: "Every item fetched",
      res: foundItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching items",
      error: error.message,
    });
  }
}
