import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_DB;
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in the environment variables');
        }

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        } as mongoose.ConnectOptions);

        console.log('MongoDB connect');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
} 

export default connectDB;