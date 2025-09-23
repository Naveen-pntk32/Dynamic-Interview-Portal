const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId },
    response: { type: mongoose.Schema.Types.Mixed },
    score: { type: Number, default: 0 },
  },
  { _id: false }
);

const testSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    testType: { type: String, enum: ['mcq', 'text', 'voice', 'video'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    answers: [answerSchema],
    score: { type: Number, default: 0 },
    artifacts: {
      audioPath: { type: String },
      videoPath: { type: String },
      transcript: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TestSession', testSessionSchema);


