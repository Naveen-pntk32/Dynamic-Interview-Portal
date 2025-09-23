const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['mcq', 'text', 'voice', 'video'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String },
    keywords: [{ type: String }],
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);


