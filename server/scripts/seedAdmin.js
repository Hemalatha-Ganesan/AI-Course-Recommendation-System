const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/courseai';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    const email = 'your-email@example.com';  // ← Change this to your email
    const username = 'your-username';          // ← Change this to your username
    const password = 'your-password';          // ← Change this to your password
    
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('ℹ️  Admin user already exists:', email);
      process.exit(0);
    }

    const admin = new User({
      username,
      email,
      password,
      role: 'admin'
    });

    await admin.save();
    console.log(`✅ Admin user created: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedAdmin();
