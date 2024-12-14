import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log(`Mongodb connected: ${conn.connection.host}`);
        

 }catch(error){
    console.log("Error connecting to database");
 }
};