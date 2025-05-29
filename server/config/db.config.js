import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.URI_STRING;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // exit app if db fails
  }
};

export default connectDB;

