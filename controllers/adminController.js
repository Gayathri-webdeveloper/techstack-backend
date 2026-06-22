const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn:'7d' });

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, message:'Email and password required' });
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ success:false, message:'Invalid credentials' });
    res.json({ success:true, token: genToken(admin._id), email: admin.email });
  } catch { res.status(500).json({ success:false, message:'Server error' }); }
};

const getMe = (req, res) => res.json({ success:true, email: req.admin.email });
module.exports = { login, getMe };