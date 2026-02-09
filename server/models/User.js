const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,

    interests: [String],
    skills: [String],
    goal: String,   // like "AI Engineer", "Web Developer"

    recommendations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
