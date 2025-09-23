const router = require('express').Router();
const { register, login, validateToken } = require('../controllers/authController');
const { authRequired } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/validate', authRequired, validateToken);

module.exports = router;


