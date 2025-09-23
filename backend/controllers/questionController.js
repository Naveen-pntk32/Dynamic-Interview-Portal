const QuestionBank = require('../models/QuestionBank');

async function getQuestions(req, res) {
  try {
    const { field, difficulty } = req.params;
    const questions = await QuestionBank.find({ field, difficulty });
    return res.json({ success: true, message: 'Fetched questions', data: questions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch questions', data: { error: error.message } });
  }
}

// Admin CRUD (basic)
async function createQuestion(req, res) {
  try {
    const doc = await QuestionBank.create(req.body);
    return res.status(201).json({ success: true, message: 'Question created', data: doc });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Create failed', data: { error: error.message } });
  }
}

async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const doc = await QuestionBank.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ success: true, message: 'Question updated', data: doc });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Update failed', data: { error: error.message } });
  }
}

async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    await QuestionBank.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Delete failed', data: { error: error.message } });
  }
}

module.exports = { getQuestions, createQuestion, updateQuestion, deleteQuestion };


