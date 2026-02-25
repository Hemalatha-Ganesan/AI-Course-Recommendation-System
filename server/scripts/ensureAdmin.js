const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/courseai';

async function ensureAdmin(email, password) {
  if (!email || !password) {
    console.error('Usage: node ensureAdmin.js <email> <password>');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    let user = await User.findOne({ email });
    if (user) {
      user.role = 'admin';
      user.password = password;
      await user.save();
      console.log(`✅ Updated existing user to admin: ${email}`);
    } else {
      const username = email.split('@')[0];
      user = new User({ username, email, password, role: 'admin' });
      await user.save();
      console.log(`✅ Created admin user: ${email}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error ensuring admin:', err);
    process.exit(1);
  }
}

const [,, email, password] = process.argv;
ensureAdmin(email, password);
