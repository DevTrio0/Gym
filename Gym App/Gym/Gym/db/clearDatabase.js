// Clear all collections from MongoDB - Start Fresh
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

async function clearDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {});
    
    console.log('📊 Database:', DB_NAME);
    console.log('🔗 Connection URI:', MONGODB_URI?.substring(0, 50) + '...');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('\n🗑️  Clearing all collections...\n');

    // Drop all collections
    for (const collection of collections) {
      console.log(`  🗑️  Dropping collection: ${collection.name}`);
      await mongoose.connection.db.dropCollection(collection.name);
    }

    console.log('\n✅ DATABASE COMPLETELY CLEARED!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n📝 You can now add your own data:');
    console.log('   → Sign up a new account');
    console.log('   → Create new clients/coaches');
    console.log('   → All data will be saved to MongoDB Atlas\n');
    
    // Disconnect
    await mongoose.connection.close();
    console.log('✅ MongoDB Disconnected\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    process.exit(1);
  }
}

clearDatabase();
