const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('[DATABASE CRITICAL] Neither MONGODB_URI nor MONGO_URI environment variable is defined.');
    console.error('Please set MONGO_URI or MONGODB_URI in your Render dashboard (Environment tab) or in backend/.env.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[DATABASE] MongoDB connected successfully: host=${conn.connection.host}, db=${conn.connection.name}`);
  } catch (err) {
    console.error('[DATABASE CRITICAL] MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
