import { body, validationResult } from 'express-validator';

export const validate = (validationType) => {
  const validations = {
    signup: [
      body('email').isEmail().normalizeEmail(),
      body('password').isLength({ min: 8 }),
      body('firstName').notEmpty().trim(),
      body('lastName').notEmpty().trim(),
      body('phone').isMobilePhone()
    ],
    login: [
      body('email').isEmail().normalizeEmail(),
      body('password').notEmpty()
    ],
    forgotPassword: [
      body('email').isEmail().normalizeEmail()
    ],
    resetPassword: [
      body('token').notEmpty(),
      body('newPassword').isLength({ min: 8 })
    ],
    updateProfile: [
      body('firstName').optional().trim(),
      body('lastName').optional().trim(),
      body('phone').optional().isMobilePhone()
    ],
    createCourse: [
      body('title').notEmpty(),
      body('description').notEmpty(),
      body('duration').isInt({ min: 1 }),
      body('difficulty').isIn(['beginner', 'intermediate', 'advanced']),
      body('category').notEmpty(),
      body('imageUrl').isURL(),
      body('syllabus').optional().isArray(),
      body('prerequisites').optional().isArray()
    ],
    contact: [
      body('name').notEmpty(),
      body('email').isEmail(),
      body('subject').notEmpty(),
      body('message').notEmpty().isLength({ min: 10 })
    ]
  };

  return [
    ...validations[validationType],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation errors',
          errors: errors.array() 
        });
      }
      next();
    }
  ];
};
