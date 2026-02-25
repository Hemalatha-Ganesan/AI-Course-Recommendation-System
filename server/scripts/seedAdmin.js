const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/courseai';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    const email = 'admin@test.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('ℹ️  Admin user already exists:', email);
      process.exit(0);
    }

    const admin = new User({
      username: 'admin',
      email,
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created: admin@test.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedAdmin();
