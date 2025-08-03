const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/game', gameRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Shadow Clash Backend is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
