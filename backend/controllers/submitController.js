const TestSession = require('../models/TestSession');
const QuestionBank = require('../models/QuestionBank');
const { uploadBufferToCloudinary } = require('../utils/upload');
const { speechToTextPlaceholder, analyzeVideoPlaceholder } = require('../services/aiPlaceholders');

function scoreMcq(answers, questionDocs) {
  let correct = 0;
  const answersByQuestionId = new Map(answers.map((a) => [String(a.questionId), a.response]));
  for (const q of questionDocs) {
    const response = answersByQuestionId.get(String(q._id));
    if (response && String(response).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) correct += 1;
  }
  return correct / questionDocs.length;
}

function scoreText(answerText, keywords = []) {
  if (!keywords.length) return 0;
  const text = String(answerText || '').toLowerCase();
  const matched = keywords.reduce((acc, kw) => (text.includes(String(kw).toLowerCase()) ? acc + 1 : acc), 0);
  return matched / keywords.length;
}

async function submitMcq(req, res) {
  try {
    const { field, difficulty, answers } = req.body; // answers: [{questionId, response}]
    const userId = req.user.id;
    const questions = await QuestionBank.find({ field, difficulty, type: 'mcq' });
    if (!questions.length) return res.status(400).json({ success: false, message: 'No MCQ questions found' });

    const sessionScore = scoreMcq(answers, questions);
    const session = await TestSession.create({ userId, field, testType: 'mcq', difficulty, answers, score: sessionScore });
    return res.status(201).json({ success: true, message: 'MCQ submitted', data: session });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Submit MCQ failed', data: { error: error.message } });
  }
}

async function submitText(req, res) {
  try {
    const { field, difficulty, answerText } = req.body;
    const userId = req.user.id;
    const questions = await QuestionBank.find({ field, difficulty, type: 'text' });
    if (!questions.length) return res.status(400).json({ success: false, message: 'No Text questions found' });
    // Aggregate keywords across all questions for simplicity
    const keywords = questions.flatMap((q) => q.keywords || []);
    const sessionScore = scoreText(answerText, keywords);
    const session = await TestSession.create({
      userId,
      field,
      testType: 'text',
      difficulty,
      answers: [{ response: answerText, score: sessionScore }],
      score: sessionScore,
    });
    return res.status(201).json({ success: true, message: 'Text submitted', data: session });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Submit Text failed', data: { error: error.message } });
  }
}

async function submitVoice(req, res) {
  try {
    const { field, difficulty } = req.body;
    const userId = req.user.id;
    if (!req.file) return res.status(400).json({ success: false, message: 'Audio file required' });
    const cloud = await uploadBufferToCloudinary(req.file.buffer, 'voice-uploads', 'video');
    const transcript = await speechToTextPlaceholder(req.file.buffer);
    const questions = await QuestionBank.find({ field, difficulty, type: 'text' });
    const keywords = questions.flatMap((q) => q.keywords || []);
    const sessionScore = scoreText(transcript, keywords);
    const session = await TestSession.create({
      userId,
      field,
      testType: 'voice',
      difficulty,
      answers: [{ response: transcript, score: sessionScore }],
      score: sessionScore,
      artifacts: { audioUrl: cloud.secure_url, transcript },
    });
    return res.status(201).json({ success: true, message: 'Voice submitted', data: session });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Submit Voice failed', data: { error: error.message } });
  }
}

async function submitVideo(req, res) {
  try {
    const { field, difficulty } = req.body;
    const userId = req.user.id;
    if (!req.file) return res.status(400).json({ success: false, message: 'Video file required' });

    // Upload original video
    const cloudVideo = await uploadBufferToCloudinary(req.file.buffer, 'video-uploads', 'video');

    // Analyze video (placeholder)
    const analysis = await analyzeVideoPlaceholder(req.file.buffer);

    // Upload frames (if any)
    const frameUrls = [];
    for (const buf of analysis.extractedFrameImageBuffers || []) {
      const up = await uploadBufferToCloudinary(buf, 'video-frames', 'image');
      frameUrls.push(up.secure_url);
    }

    // For scoring, extract audio->transcript (placeholder uses buffer)
    const transcript = await speechToTextPlaceholder(req.file.buffer);
    const questions = await QuestionBank.find({ field, difficulty, type: 'text' });
    const keywords = questions.flatMap((q) => q.keywords || []);
    const sessionScore = scoreText(transcript, keywords);

    const session = await TestSession.create({
      userId,
      field,
      testType: 'video',
      difficulty,
      answers: [{ response: transcript, score: sessionScore }],
      score: sessionScore,
      artifacts: { videoUrl: cloudVideo.secure_url, frameImageUrls: frameUrls, transcript },
    });

    return res.status(201).json({ success: true, message: 'Video submitted', data: session });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Submit Video failed', data: { error: error.message } });
  }
}

module.exports = { submitMcq, submitText, submitVoice, submitVideo };


