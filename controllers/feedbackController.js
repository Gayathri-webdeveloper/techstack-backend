const Feedback  = require('../models/Feedback');
const validator = require('validator');

const SERVICES = [
  'Web Development','Mobile App Development','AI & Automation',
  'E-Commerce Platform','Academic / Final Year Project',
  'UI/UX Design','Embedded System Project','Hardware Project','Other',
];

// PUBLIC — Submit feedback (client fills form after project)
const submitFeedback = async (req, res) => {
  try {
    const { name, role, service, rating, message } = req.body;

    if (!name || !role || !service || !rating || !message)
      return res.status(400).json({ success: false, message: 'All fields are required.' });

    if (!SERVICES.includes(service))
      return res.status(400).json({ success: false, message: 'Invalid service selected.' });

    const r = parseInt(rating);
    if (isNaN(r) || r < 1 || r > 5)
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });

    if (message.trim().length < 20)
      return res.status(400).json({ success: false, message: 'Feedback must be at least 20 characters.' });

    const feedback = await Feedback.create({
      name: name.trim(),
      role: role.trim(),
      service,
      rating: r,
      message: message.trim(),
      approved: false, // needs admin approval first
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! It will appear after review.',
      id: feedback._id,
    });
  } catch (err) {
    console.error('Feedback submit error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// PUBLIC — Get only approved feedbacks
const getApprovedFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ approved: true })
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json({ success: true, feedbacks });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADMIN — Get ALL feedbacks
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADMIN — Approve or reject feedback
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { approved: req.body.approved },
      { new: true }
    );
    if (!feedback) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, feedback });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADMIN — Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  submitFeedback,
  getApprovedFeedbacks,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
};