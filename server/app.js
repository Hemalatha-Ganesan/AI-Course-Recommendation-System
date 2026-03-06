const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '.env'),
  override: true,
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/users', userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  WARNING: JWT_SECRET is not set in .env file. Authentication will fail!');
  }
});
