const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');

dotenv.config();

async function getStats() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const published = await Course.countDocuments({isPublished: true});
    const total = await Course.countDocuments();
    const categories = await Course.aggregate([
      { $match: {isPublished: true} },
      { $group: {_id: '$category', count: {$sum: 1}} },
      { $sort: {count: -1} }
    ]);
    console.log(`Published courses: ${published}`);
    console.log(`Total courses: ${total}`);
    console.log('Categories:', categories);
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

getStats();
