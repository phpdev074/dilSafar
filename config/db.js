
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const connectDB = async () => {
    try {
        console.log("Mongo URI:", process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);  
    }
};

connectDB(); 
export default connectDB;
