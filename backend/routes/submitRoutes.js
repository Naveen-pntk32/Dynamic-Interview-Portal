const router = require('express').Router();
const { authRequired } = require('../middleware/authMiddleware');
const { upload } = require('../utils/upload');
const { submitMcq, submitText, submitVoice, submitVideo } = require('../controllers/submitController');

router.post('/mcq', authRequired, submitMcq);
router.post('/text', authRequired, submitText);
router.post('/voice', authRequired, upload.single('audio'), submitVoice);
router.post('/video', authRequired, upload.single('video'), submitVideo);

module.exports = router;


