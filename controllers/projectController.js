const Project = require('../models/Project');

// PUBLIC — GET all visible projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ visible: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, projects });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

// ADMIN — GET all projects including hidden
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, projects });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

// ADMIN — CREATE project
const createProject = async (req, res) => {
  try {
    const { title, description, icon, tags, liveUrl, order } = req.body;
    if (!title || !description) return res.status(400).json({ success: false, message: 'Title and description required' });
    const project = await Project.create({
      title, description,
      icon: icon || '🚀',
      tags: tags || [],
      liveUrl: liveUrl || '',
      order: order || 0,
    });
    res.status(201).json({ success: true, project });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

// ADMIN — UPDATE project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, project });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

// ADMIN — DELETE project
const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

module.exports = { getProjects, getAllProjects, createProject, updateProject, deleteProject };