const router = require('express').Router();
const { authRequired } = require('../middleware/authMiddleware');
const { getResults, getNextDifficulty } = require('../controllers/resultController');

router.get('/:userId', authRequired, getResults);
router.get('/next-difficulty/:userId', authRequired, getNextDifficulty);

module.exports = router;


