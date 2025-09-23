const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank' },
    questionNumber: { type: Number },
    response: { type: mongoose.Schema.Types.Mixed },
    score: { type: Number, default: 0 },
  },
  { _id: false }
);

const testSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testType: { type: String, enum: ['mcq', 'text', 'voice', 'video'], required: true },
    field: { type: String },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    answers: [answerSchema],
    score: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    artifacts: {
      audioUrl: { type: String },
      videoUrl: { type: String },
      frameImageUrls: [{ type: String }],
      transcript: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TestSession', testSessionSchema);


