// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     password: String,

//     interests: [String],
//     skills: [String],
//     goal: String,   // like "AI Engineer", "Web Developer"

//     recommendations: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Course'
//         }
//     ]
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please provide a name'],
//     trim: true,
//     maxlength: [50, 'Name cannot be more than 50 characters']
//   },
//   email: {
//     type: String,
//     required: [true, 'Please provide an email'],
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [
//       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//       'Please provide a valid email'
//     ]
//   },
//   password: {
//     type: String,
//     required: [true, 'Please provide a password'],
//     minlength: [6, 'Password must be at least 6 characters'],
//     select: false
//   },
//   role: {
//     type: String,
//     enum: ['student', 'instructor', 'admin'],
//     default: 'student'
//   },
//   avatar: {
//     type: String,
//     default: ''
//   },
//   enrolledCourses: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Course'
//   }],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     return next();
//   }
  
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);

// server/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false   // 🔥 IMPORTANT
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  }
}, { timestamps: true });


// 🔥 HASH PASSWORD BEFORE SAVE
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// 🔥 COMPARE PASSWORD METHOD
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
