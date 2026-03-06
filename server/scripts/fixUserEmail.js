const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/courseai';

async function fixUserEmail() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const User = require('../models/User');

    // Find user with the invalid email (missing @)
    const invalidEmail = 'hemalathaganesan08gmail.com';
    const user = await User.findOne({ email: invalidEmail });

    if (user) {
      console.log(`✅ Found user: ${user.username} with email: ${user.email}`);
      
      // Update to valid email
      const newEmail = 'hemalathaganesan08@gmail.com';
      
      // Check if the new email already exists
      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser) {
        console.log('❌ The corrected email already exists. Please delete the invalid user first.');
        process.exit(1);
      }

      user.email = newEmail;
      await user.save();
      
      console.log(`✅ Updated email from '${invalidEmail}' to '${newEmail}'`);
    } else {
      console.log('ℹ️  No user found with the invalid email format');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fixUserEmail();

