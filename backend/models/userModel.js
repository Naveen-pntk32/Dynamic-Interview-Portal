const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    bio: { type: String, default: '' },
    webpage: { type: String, default: '' },
    resume: { type: String, default: '' },
    phone: { type: String, default: '' },
    skills: { type: [String], default: [] },
    interviewHistory: [
      {
        title: { type: String },
        score: { type: Number },
        date: { type: Date, default: Date.now },
        type: { type: String }
      }
    ],
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);