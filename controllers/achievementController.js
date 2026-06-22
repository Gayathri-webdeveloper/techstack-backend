const Achievement = require('../models/Achievement');

const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ visible: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, achievements });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, achievements });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

const createAchievement = async (req, res) => {
  try {
    const { title, description, icon, date, order } = req.body;
    if (!title || !description) return res.status(400).json({ success: false, message: 'Title and description required' });
    const achievement = await Achievement.create({ title, description, icon: icon||'🏆', date: date||'', order: order||0 });
    res.status(201).json({ success: true, achievement });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

const updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!achievement) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, achievement });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

const deleteAchievement = async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

module.exports = { getAchievements, getAllAchievements, createAchievement, updateAchievement, deleteAchievement };