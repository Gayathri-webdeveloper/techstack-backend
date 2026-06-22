const express = require('express');
const router = express.Router();
const { getAchievements, getAllAchievements, createAchievement, updateAchievement, deleteAchievement } = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');

router.get('/',       getAchievements);                 // public
router.get('/all',    protect, getAllAchievements);      // admin
router.post('/',      protect, createAchievement);      // admin
router.put('/:id',    protect, updateAchievement);      // admin
router.delete('/:id', protect, deleteAchievement);      // admin

module.exports = router;