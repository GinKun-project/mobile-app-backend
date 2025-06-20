const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret'; // Secure this in .env

// Generate a token for a user
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '7d', // or '1h', etc.
  });
};

module.exports = {
  generateToken,
};
