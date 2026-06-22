const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true, maxlength: 60 },
  role:       { type: String, required: true, trim: true, maxlength: 80 },
  service:    { type: String, required: true },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  message:    { type: String, required: true, maxlength: 500 },
  approved:   { type: Boolean, default: false }, // admin must approve before showing
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);