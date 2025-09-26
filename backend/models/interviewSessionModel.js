const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    userAnswer: { type: String },
    isCorrect: { type: Boolean },
    accuracyScore: { type: Number },
    correctAnswer: { type: String },
    answerKeywords: [{ type: String }],
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fieldId: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    finalScore: { type: Number, required: true },
    totalPossibleScore: { type: Number, required: true },
    responses: [responseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);


