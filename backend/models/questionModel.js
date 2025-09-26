const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  fieldId: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
  difficulty: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  questionType: { type: String, required: true, enum: ['mcq', 'descriptive'] },
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  answerKeywords: [{ type: String }],
});

module.exports = mongoose.model('Question', questionSchema);


