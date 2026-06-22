const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  icon:        { type: String, default: '🚀' },
  tags:        [{ type: String }],
  liveUrl:     { type: String, default: '' },
  order:       { type: Number, default: 0 },
  visible:     { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Project', projectSchema);