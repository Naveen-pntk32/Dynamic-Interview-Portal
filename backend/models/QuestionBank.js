const mongoose = require('mongoose');

const questionBankSchema = new mongoose.Schema(
  {
    field: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    question: { type: String, required: true },
    type: { type: String, enum: ['mcq', 'text'], required: true },
    options: [{ type: String }],
    correctAnswer: { type: String },
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuestionBank', questionBankSchema);


