// routes/contact.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { submitContact, getContacts, updateStatus, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const limiter = rateLimit({ windowMs:15*60*1000, max:5, message:{ success:false, message:'Too many submissions. Try again in 15 minutes.' }});
router.post('/', limiter, submitContact);
router.get('/', protect, getContacts);
router.patch('/:id/status', protect, updateStatus);
router.delete('/:id', protect, deleteContact);
module.exports = router;