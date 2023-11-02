import mongoose from "mongoose"

const dbConfig = async ()=>{
    try {
        await mongoose.connect(process.env.DBURL);
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

export default dbConfig;