import express from 'express';
import { 
  signup, 
  login, 
  forgotPassword, 
  resetPassword, 
  verifyToken 
} from '../controllers/authController.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Authentication routes
router.post('/signup', validate('signup'), signup);
router.post('/login', validate('login'), login);
router.post('/forgot-password', validate('forgotPassword'), forgotPassword);
router.post('/reset-password', validate('resetPassword'), resetPassword);

// Token verification
router.get('/verify', verifyToken);

export default router;
