const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
router.post('/login', login);
router.get('/me', protect, getMe);
module.exports = router;