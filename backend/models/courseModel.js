const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    categoryId: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    students: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    topics: { type: [String], required: true }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;