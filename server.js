require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');
const Admin     = require('./models/Admin');

const app = express();
connectDB();

const seedAdmin = async () => {
  try {
    const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!exists) {
      await Admin.create({
        email:    process.env.ADMIN_EMAIL    || 'admin@techstack.dev',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
      });
      console.log('✅ Admin seeded:', process.env.ADMIN_EMAIL);
    }
  } catch(e) { console.error('Seed error:', e.message); }
};
seedAdmin();

app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', /\.vercel\.app$/],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/contact',      require('./routes/contact'));
app.use('/api/admin',        require('./routes/admin'));
app.use('/api/projects',     require('./routes/projects'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/feedback',     require('./routes/feedback'));

app.get('/', (req, res) => res.json({ status: '🟢 TechStack API Running', time: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: 'Server error' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 TechStack API running on port ${PORT}`));