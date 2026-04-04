const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Course = require('../models/Course');

dotenv.config({ path: './../../.env' });
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_course_recommendation';

async function debugEnrollments() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔍 DEBUG: Connected to MongoDB');

    // Find ALL non-admin users
    const users = await User.find({ role: { $ne: 'admin' } }).select('_id username email');
    console.log(`👥 Found ${users.length} non-admin users:`);
    users.forEach((user, i) => console.log(`  ${i+1}. ${user.username} (${user.email}) [${user._id}]`));

    // Check ALL enrollments
    const allEnrollments = await Enrollment.find().populate('student', 'username email').populate('course', 'title');
    console.log(`\n📚 TOTAL Enrollments: ${allEnrollments.length}`);
    
    if (allEnrollments.length === 0) {
      console.log('❌ NO enrollments found! Run seed script first.');
    } else {
      allEnrollments.forEach((enr, i) => {
        console.log(`  ${i+1}. ${enr.student?.username || 'Unknown'} → "${enr.course?.title || 'Unknown'}" (${enr.progress || 0}%)`);
      });
    }

    // Summary per user
    console.log('\n📊 USER Enrollment Summary:');
    for (const user of users) {
      const userEnrollments = await Enrollment.find({ student: user._id }).populate('course', 'title');
      console.log(`${user.username}: ${userEnrollments.length} courses`);
      userEnrollments.slice(0, 3).forEach(c => console.log(`  → ${c.course?.title}`));
      if (userEnrollments.length > 3) console.log(`  ... +${userEnrollments.length-3} more`);
    }

    console.log('\n✅ DEBUG Complete! Check if YOUR user has enrollments.');
    process.exit(0);
  } catch (error) {
    console.error('❌ DEBUG Failed:', error);
    process.exit(1);
  }
}

debugEnrollments();

