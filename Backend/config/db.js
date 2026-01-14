const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Prefer MONGO_URI from env, fallback to local MongoDB URI
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/Agastya';

    await mongoose.connect(uri);

    console.log(`MongoDB connected: ${uri.startsWith('mongodb+srv') ? 'Atlas' : 'Local'}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
