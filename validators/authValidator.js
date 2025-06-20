const { body } = require('express-validator');

exports.validateSignup = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email')
    .normalizeEmail()
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .trim()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.validateLogin = [
  body('email')
    .normalizeEmail()
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required'),
];
