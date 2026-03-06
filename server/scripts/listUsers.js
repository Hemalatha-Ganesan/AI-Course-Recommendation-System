const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/courseai';

async function listUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = require('../models/User');

    // List all users
    const users = await User.find({}, 'username email role createdAt').lean();
    
    if (users.length === 0) {
      console.log('ℹ️  No users found in the database');
    } else {
      console.log(`Found ${users.length} user(s):\n`);
      users.forEach((u, i) => {
        console.log(`${i + 1}. Username: ${u.username}`);
        console.log(`   Email: ${u.email}`);
        console.log(`   Role: ${u.role}`);
        console.log(`   Created: ${u.createdAt}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

listUsers();

