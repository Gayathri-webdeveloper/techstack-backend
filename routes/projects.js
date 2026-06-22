const express = require('express');
const router = express.Router();
const { getProjects, getAllProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.get('/',           getProjects);              // public
router.get('/all',        protect, getAllProjects);   // admin
router.post('/',          protect, createProject);   // admin
router.put('/:id',        protect, updateProject);   // admin
router.delete('/:id',     protect, deleteProject);   // admin

module.exports = router;