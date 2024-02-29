import mongoose from "mongoose";

const connectToDb = async () => {
    const MONGODB_URL = process.env.MONGODB_URL;
    try {
        await mongoose.connect(`${MONGODB_URL}`)
        console.log("MongoDb is connected successfully")
    } catch (error) {
        throw error
        console.log(error)
    }
}

export default connectToDb;