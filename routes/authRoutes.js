const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/authController');
const { check } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');

// POST /api/auth/signup
router.post(
  '/signup',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
  ],
  validateRequest,
  signup
);

// POST /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password is required').notEmpty(),
  ],
  validateRequest,
  login
);

module.exports = router;
