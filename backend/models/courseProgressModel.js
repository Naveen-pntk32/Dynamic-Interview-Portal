const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    attempts: { type: Number, default: 0 },
    score: { type: Number, default: null }, // optional numeric score for quizzes/tests
    timeSpentSeconds: { type: Number, default: 0 }, // total time spent in seconds
    startedAt: { type: Date, default: null },
    lastAccessedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    metadata: { type: Object, default: {} } // flexible field for extra data (answers, device info, etc.)
  },
  { timestamps: true }
);

// Ensure one document per user+course
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('CourseProgress', courseProgressSchema);
