// Test MongoDB connection
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/aau_club';

console.log('Attempting to connect to MongoDB at:', MONGO_URL);

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }); 