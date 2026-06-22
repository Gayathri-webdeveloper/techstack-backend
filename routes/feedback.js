const express = require('express');
const router  = express.Router();
const rateLimit = require('express-rate-limit');
const {
  submitFeedback, getApprovedFeedbacks,
  getAllFeedbacks, updateFeedback, deleteFeedback
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

// Rate limit — max 3 feedback submissions per IP per hour
const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 3,
  message: { success: false, message: 'Too many submissions. Try again later.' }
});

router.post('/',          feedbackLimiter, submitFeedback);     // public
router.get('/',           getApprovedFeedbacks);                // public
router.get('/all',        protect, getAllFeedbacks);            // admin
router.patch('/:id',      protect, updateFeedback);            // admin
router.delete('/:id',     protect, deleteFeedback);            // admin

module.exports = router;