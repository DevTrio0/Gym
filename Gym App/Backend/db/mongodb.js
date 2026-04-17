const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'gym_app';

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: DB_NAME,
    });

    console.log('\n✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${DB_NAME}`);
    console.log(`🔗 Connection URI: ${MONGODB_URI.substring(0, 50)}...`);
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error(error.message);
    process.exit(1);
  }
};

// Disconnect MongoDB
const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB Disconnected');
  } catch (error) {
    console.error('❌ MongoDB Disconnection Error:', error.message);
  }
};

// Get MongoDB instance
const getDB = () => {
  return mongoose.connection;
};

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
  getDB,
  mongoose
};
