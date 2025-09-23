const router = require('express').Router();
const { getQuestions, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { authRequired, adminOnly } = require('../middleware/authMiddleware');

router.get('/:field/:difficulty', authRequired, getQuestions);

// Admin management
router.post('/', authRequired, adminOnly, createQuestion);
router.put('/:id', authRequired, adminOnly, updateQuestion);
router.delete('/:id', authRequired, adminOnly, deleteQuestion);

module.exports = router;


