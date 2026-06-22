const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  email:      { type: String, required: true, trim: true, lowercase: true },
  phone:      { type: String, default: '' },
  service:    { type: String, required: true },
  budget:     { type: String, default: 'Not specified' },
  message:    { type: String, required: true },
  status:     { type: String, enum: ['new','read','replied'], default: 'new' },
}, { timestamps: true });
module.exports = mongoose.model('Contact', contactSchema);