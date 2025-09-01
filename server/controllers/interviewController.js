import { InterviewQuestion, InterviewAttempt, Feedback } from "../models/Interview.js";
import { validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for interview file uploads
const interviewStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/interviews";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `interview-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const interviewFileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx", ".txt"];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Only text documents and PDFs are allowed"), false);
  }
};

export const interviewUpload = multer({
  storage: interviewStorage,
  fileFilter: interviewFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export const generateQuestions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { type, limit = 10 } = req.body;
    const validTypes = ["mcq", "text", "coding", "behavioral"];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question type",
      });
    }

    const questions = await InterviewQuestion.findByType(type, limit);

    // Remove correct answers from response
    const sanitizedQuestions = questions.map(q => ({
      ...q,
      correct_answer: undefined
    }));

    res.json({
      success: true,
      data: {
        questions: sanitizedQuestions,
        type,
        count: sanitizedQuestions.length
      }
    });
    
  } catch (error) {
    console.error("Generate questions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const startAttempt = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { type, questions } = req.body;
    
    const attempt = await InterviewAttempt.create({
      userId: req.user.id,
      type,
      questions,
      totalQuestions: questions.length
    });

    res.status(201).json({
      success: true,
      message: "Interview attempt started",
      data: {
        attemptId: attempt.id,
        type: attempt.type,
        startedAt: attempt.created_at
      }
    });
    
  } catch (error) {
    console.error("Start attempt error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const submitAttempt = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { attemptId, answers, score, timeTaken } = req.body;
    
    const attempt = await InterviewAttempt.submit(attemptId, {
      answers,
      score,
      timeTaken
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Interview attempt not found",
      });
    }

    res.json({
      success: true,
      message: "Interview submitted successfully",
      data: {
        score: attempt.score,
        timeTaken: attempt.time_taken,
        completedAt: attempt.completed_at
      }
    });
    
  } catch (error) {
    console.error("Submit attempt error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const uploadInterviewFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileUrl = `/uploads/interviews/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size
      }
    });
    
  } catch (error) {
    console.error("Upload interview file error:", error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAttemptHistory = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    const attempts = await InterviewAttempt.findByUserId(
      req.user.id,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({
      success: true,
      data: {
        attempts,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      }
    });
    
  } catch (error) {
    console.error("Get attempt history error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAttemptDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const attempt = await InterviewAttempt.findById(id);
    
    if (!attempt || attempt.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    // Parse stored JSON data
    const questions = JSON.parse(attempt.questions);
    const answers = attempt.answers ? JSON.parse(attempt.answers) : null;

    res.json({
      success: true,
      data: {
        attempt: {
          ...attempt,
          questions,
          answers
        }
      }
    });
    
  } catch (error) {
    console.error("Get attempt details error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { attemptId, feedback, rating } = req.body;
    
    const newFeedback = await Feedback.create({
      attemptId,
      userId: req.user.id,
      feedback,
      rating: Math.min(Math.max(rating, 1), 5) // Ensure rating between 1-5
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted",
      data: {
        feedback: newFeedback
      }
    });
    
  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAttemptStats = async (req, res) => {
  try {
    const stats = await InterviewAttempt.getStats(req.user.id);
    
    res.json({
      success: true,
      data: {
        stats
      }
    });
    
  } catch (error) {
    console.error("Get attempt stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
