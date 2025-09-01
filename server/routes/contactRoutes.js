import express from 'express';
import { Contact } from '../models/Contact.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validate('contact'), async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contactMessage = await Contact.create({ name, email, subject, message });
    res.status(201).json({
      success: true,
      message: 'Message received',
      data: contactMessage
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
});

export default router;
