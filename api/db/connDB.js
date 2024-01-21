import mongoose from "mongoose";

export const connDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Successfully Connected");
    } catch (error) {
        console.log(error);
    }
}

// export default connDB