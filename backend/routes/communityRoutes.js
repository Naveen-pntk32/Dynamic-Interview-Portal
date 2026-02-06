const express = require('express');
const router = express.Router();
const { getCommunityStats, getLeaderboard } = require('../controllers/communityController');

router.get('/stats', getCommunityStats);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
