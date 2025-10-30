const express = require('express');
const router = express.Router();
const {loginUser, registerUser, getAllProfiles, getProfile, updateProfile, deleteProfile} = require('../controllers/userController');

router.get('/', (req, res) => {
    res.send("User router");
});

router.post('/login', loginUser);
router.post('/register', registerUser);

router.get('/profiles', getAllProfiles);
router.get('/profile/:userId', getProfile);

router.put('/profile/:userId', updateProfile);
router.delete('/profile/', deleteProfile);

module.exports = router;