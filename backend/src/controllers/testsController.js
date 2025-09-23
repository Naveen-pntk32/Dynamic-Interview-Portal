const fs = require('fs');
const path = require('path');
const Course = require('../models/Course');
const TestSession = require('../models/TestSession');
const { scoreMcq, scoreText } = require('../utils/scoring');
const { speechToText } = require('../utils/speechStub');
const { analyzeVideo } = require('../utils/videoStub');

// GET /questions/:courseId/:difficulty
async function getQuestionsByDifficulty(req, res) {
  const { courseId, difficulty } = req.params;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  const questions = course.questions.filter((q) => q.difficulty === difficulty);
  return res.json({ success: true, message: 'Questions fetched', data: questions });
}

// POST /submit/mcq
async function submitMcq(req, res) {
  const { userId, courseId, questionId, selectedAnswer, difficulty } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  const q = course.questions.id(questionId);
  if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
  const score = scoreMcq(selectedAnswer, q.correctAnswer);
  const session = await TestSession.create({ userId, courseId, testType: 'mcq', difficulty: difficulty || q.difficulty, answers: [{ questionId, response: selectedAnswer, score }], score });
  return res.status(201).json({ success: true, message: 'MCQ evaluated', data: { session, score } });
}

// POST /submit/text
async function submitText(req, res) {
  const { userId, courseId, questionId, answerText, difficulty } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  const q = course.questions.id(questionId);
  if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
  const { matchedKeywords, totalKeywords, score } = scoreText(answerText, q.keywords || []);
  const session = await TestSession.create({ userId, courseId, testType: 'text', difficulty: difficulty || q.difficulty, answers: [{ questionId, response: answerText, score }], score });
  return res.status(201).json({ success: true, message: 'Text evaluated', data: { session, matchedKeywords, totalKeywords, score } });
}

// POST /submit/voice  (file: audio)
async function submitVoice(req, res) {
  try {
    const { userId, courseId, questionId, difficulty } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Audio file required' });
    const filePath = req.file.path;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const q = course.questions.id(questionId);
    if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
    const transcript = await speechToText(filePath);
    const { matchedKeywords, totalKeywords, score } = scoreText(transcript, q.keywords || []);
    const session = await TestSession.create({ userId, courseId, testType: 'voice', difficulty: difficulty || q.difficulty, answers: [{ questionId, response: transcript, score }], score, artifacts: { audioPath: filePath, transcript } });
    // Cleanup
    fs.unlink(filePath, () => {});
    return res.status(201).json({ success: true, message: 'Voice evaluated', data: { session, matchedKeywords, totalKeywords, score } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Voice submit failed', data: { error: e.message } });
  }
}

// POST /submit/video  (file: video)
async function submitVideo(req, res) {
  try {
    const { userId, courseId, questionId, difficulty } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Video file required' });
    const filePath = req.file.path;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const q = course.questions.id(questionId);
    if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
    const analysis = await analyzeVideo(filePath);
    // For demo, treat video by extracting transcript via speech stub.
    const transcript = await speechToText(filePath);
    const { matchedKeywords, totalKeywords, score } = scoreText(transcript, q.keywords || []);
    const session = await TestSession.create({ userId, courseId, testType: 'video', difficulty: difficulty || q.difficulty, answers: [{ questionId, response: transcript, score }], score, artifacts: { videoPath: filePath, transcript } });
    // Cleanup
    fs.unlink(filePath, () => {});
    return res.status(201).json({ success: true, message: 'Video evaluated', data: { session, matchedKeywords, totalKeywords, score, analysis } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Video submit failed', data: { error: e.message } });
  }
}

// GET /results/:userId
async function getResults(req, res) {
  const { userId } = req.params;
  const sessions = await TestSession.find({ userId }).sort({ createdAt: -1 });
  const average = sessions.length ? sessions.reduce((a, s) => a + (s.score || 0), 0) / sessions.length : 0;
  return res.json({ success: true, message: 'Results fetched', data: { sessions, average } });
}

// GET /next-difficulty/:userId
async function getNextDifficulty(req, res) {
  const { userId } = req.params;
  const sessions = await TestSession.find({ userId });
  const avg = sessions.length ? sessions.reduce((a, s) => a + (s.score || 0), 0) / sessions.length : 0;
  let next = 'easy';
  if (avg >= 0.7) next = 'hard';
  else if (avg >= 0.4) next = 'medium';
  return res.json({ success: true, message: 'Next difficulty', data: { average: avg, next } });
}

module.exports = {
  getQuestionsByDifficulty,
  submitMcq,
  submitText,
  submitVoice,
  submitVideo,
  getResults,
  getNextDifficulty,
};


