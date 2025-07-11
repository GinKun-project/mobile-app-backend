const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); //Call before app.listen

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); 

app.get('/', (req, res) => {
  res.send('Shadow Clash API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
