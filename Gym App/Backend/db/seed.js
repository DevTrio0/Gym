const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { 
  User, 
  Coach, 
  Client, 
  SubscriptionPlan, 
  DietPlan, 
  TrainingPlan, 
  ClientNotes, 
  Payment 
} = require('./mongoModels');

const { connectMongoDB, disconnectMongoDB } = require('./mongodb');

const seedDatabase = async () => {
  try {
    await connectMongoDB();

    console.log('\n🌱 Starting Database Seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Coach.deleteMany({}),
      Client.deleteMany({}),
      SubscriptionPlan.deleteMany({}),
      DietPlan.deleteMany({}),
      TrainingPlan.deleteMany({}),
      ClientNotes.deleteMany({}),
      Payment.deleteMany({})
    ]);
    console.log('✅ Collections cleared\n');

    // Create subscription plans first
    console.log('📋 Creating subscription plans...');
    const plans = await SubscriptionPlan.insertMany([
      {
        name: 'Basic Plan',
        price: 50,
        duration: 30,
        type: 'gym',
        description: 'Basic gym access',
        features: ['Gym Access', 'Basic Support'],
        active: true
      },
      {
        name: 'Premium Plan',
        price: 100,
        duration: 30,
        type: 'online',
        description: 'Online coaching with diet plan',
        features: ['Online Coaching', 'Diet Plan', 'Video Support'],
        active: true
      },
      {
        name: 'Elite Plan',
        price: 150,
        duration: 30,
        type: 'hybrid',
        description: 'Gym + Online coaching',
        features: ['Gym Access', 'Online Coaching', 'Diet Plan', 'Priority Support'],
        active: true
      }
    ]);
    console.log(`✅ Created ${plans.length} subscription plans\n`);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      status: 'active'
    });
    console.log(`✅ Admin created: ${adminUser.email}\n`);

    // Create coach user and coach profile
    console.log('💪 Creating coach user and profile...');
    const coachUser = await User.create({
      name: 'John Coach',
      email: 'john@coach.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'coach',
      status: 'active'
    });
    
    const coachProfile = await Coach.create({
      userId: coachUser._id,
      name: 'John Coach',
      email: 'john@coach.com',
      specialization: 'Strength Training',
      bio: 'Expert in strength and conditioning',
      status: 'active',
      clients: [],
      approvedAt: new Date()
    });
    console.log(`✅ Coach created: ${coachUser.email}\n`);

    // Create client user and client profile
    console.log('👤 Creating client user and profile...');
    const clientUser = await User.create({
      name: 'Jane Client',
      email: 'jane@client.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'client',
      status: 'active'
    });
    
    const clientProfile = await Client.create({
      userId: clientUser._id,
      name: 'Jane Client',
      email: 'jane@client.com',
      coachId: coachProfile._id,
      subscription: {
        planId: plans[0]._id,
        method: 'gym',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      progress: {
        dietProgress: 'Good',
        workoutProgress: '80%',
        notes: 'Progressing well'
      },
      status: 'active'
    });
    console.log(`✅ Client created: ${clientUser.email}\n`);

    // Add client to coach's client list
    coachProfile.clients.push(clientProfile._id);
    await coachProfile.save();

    // Create diet plan
    console.log('🍎 Creating diet plan...');
    const dietPlan = await DietPlan.create({
      clientId: clientProfile._id,
      coachId: coachProfile._id,
      plan: {
        breakfast: '500 cal - Oatmeal with fruits',
        lunch: '600 cal - Chicken with vegetables',
        dinner: '500 cal - Fish with rice',
        snacks: '200 cal - Greek yogurt with nuts'
      }
    });
    console.log(`✅ Diet plan created\n`);

    // Create training plan
    console.log('🏋️ Creating training plan...');
    const trainingPlan = await TrainingPlan.create({
      clientId: clientProfile._id,
      coachId: coachProfile._id,
      weekNumber: 1,
      plan: {
        monday: 'Chest & Triceps - 4 sets x 8-10 reps',
        tuesday: 'Back & Biceps - 4 sets x 8-10 reps',
        wednesday: 'Rest or Light cardio',
        thursday: 'Legs - 4 sets x 8-10 reps',
        friday: 'Shoulders & Core - 3 sets x 10-12 reps',
        saturday: 'Full Body - 3 sets x 10-12 reps',
        sunday: 'Rest'
      }
    });
    console.log(`✅ Training plan created\n`);

    // Create client notes
    console.log('📝 Creating client notes...');
    const notes = await ClientNotes.create({
      clientId: clientProfile._id,
      coachId: coachProfile._id,
      note: 'Jane is doing great with her workout routine. Good consistency and form improving.'
    });
    console.log(`✅ Client notes created\n`);

    // Create payment record
    console.log('💳 Creating payment record...');
    const payment = await Payment.create({
      clientId: clientProfile._id,
      planId: plans[0]._id,
      amount: 50,
      method: 'credit_card',
      status: 'completed',
      transactionId: 'TXN_' + Date.now()
    });
    console.log(`✅ Payment record created\n`);

    console.log('═'.repeat(50));
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('═'.repeat(50));
    console.log('\n📊 Summary:');
    console.log(`   ✓ Users: 3 (1 Admin, 1 Coach, 1 Client)`);
    console.log(`   ✓ Subscription Plans: ${plans.length}`);
    console.log(`   ✓ Coach Profiles: 1`);
    console.log(`   ✓ Client Profiles: 1`);
    console.log(`   ✓ Diet Plans: 1`);
    console.log(`   ✓ Training Plans: 1`);
    console.log(`   ✓ Client Notes: 1`);
    console.log(`   ✓ Payment Records: 1\n`);
    console.log('🔑 Test Credentials:');
    console.log('   Admin: admin@gmail.com / admin123');
    console.log('   Coach: john@coach.com / admin123');
    console.log('   Client: jane@client.com / admin123\n');

    await disconnectMongoDB();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding Error:');
    console.error(error.message);
    console.error(error.stack);
    await disconnectMongoDB();
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
