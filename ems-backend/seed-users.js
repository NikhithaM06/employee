const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ems';

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📡 Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create admin user
    const adminUser = new User({
      email: 'admin@ems.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Admin created: admin@ems.com / admin123');

    // Create regular user
    const regularUser = new User({
      email: 'user@ems.com',
      password: 'user123',
      role: 'user'
    });
    await regularUser.save();
    console.log('✅ User created: user@ems.com / user123');

    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedUsers();
