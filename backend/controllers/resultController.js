const TestSession = require('../models/TestSession');
const { predictNextDifficulty } = require('../utils/difficulty');

async function getResults(req, res) {
  try {
    const { userId } = req.params;
    const results = await TestSession.find({ userId }).sort({ createdAt: -1 });
    const avg = results.length ? results.reduce((a, b) => a + (b.score || 0), 0) / results.length : 0;
    return res.json({ success: true, message: 'Results fetched', data: { results, averageScore: avg } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch results', data: { error: error.message } });
  }
}

async function getNextDifficulty(req, res) {
  try {
    const { userId } = req.params;
    const results = await TestSession.find({ userId });
    const avg = results.length ? results.reduce((a, b) => a + (b.score || 0), 0) / results.length : 0;
    const next = predictNextDifficulty(avg);
    return res.json({ success: true, message: 'Next difficulty predicted', data: { averageScore: avg, nextDifficulty: next } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Prediction failed', data: { error: error.message } });
  }
}

module.exports = { getResults, getNextDifficulty };


