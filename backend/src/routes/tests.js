const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const {
  getQuestionsByDifficulty,
  submitMcq,
  submitText,
  submitVoice,
  submitVideo,
  getResults,
  getNextDifficulty,
} = require('../controllers/testsController');

const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

// Exact paths per spec
router.get('/questions/:courseId/:difficulty', auth, getQuestionsByDifficulty);
router.post('/submit/mcq', auth, submitMcq);
router.post('/submit/text', auth, submitText);
router.post('/submit/voice', auth, upload.single('audio'), submitVoice);
router.post('/submit/video', auth, upload.single('video'), submitVideo);
router.get('/results/:userId', auth, getResults);
router.get('/next-difficulty/:userId', auth, getNextDifficulty);

module.exports = router;


