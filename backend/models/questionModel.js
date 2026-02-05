const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },

        type: {
            type: String,
            enum: ['mcq', 'text'],
            required: true
        },

        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true
        },

        question: { type: String, required: true },

        options: { type: [String], efault: null },

        correctOption: { type: Number, default: null },

        keywords: { type: [String], default: null },

        explanation: { type: String, default: null }
    },

    { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
