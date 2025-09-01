import express from 'express';
import {
  generateQuestions,
  startAttempt,
  submitAttempt,
  uploadInterviewFile,
  getAttemptHistory,
  getAttemptDetails,
  submitFeedback,
  getAttemptStats
} from '../controllers/interviewController.js';
import { interviewUpload } from '../controllers/interviewController.js';

const router = express.Router();

router.post('/questions', generateQuestions);
router.post('/start', startAttempt);
router.post('/submit', submitAttempt);
router.post('/upload', interviewUpload.single('file'), uploadInterviewFile);
router.get('/history', getAttemptHistory);
router.get('/:id', getAttemptDetails);
router.post('/:id/feedback', submitFeedback);
router.get('/stats', getAttemptStats);

export default router;
