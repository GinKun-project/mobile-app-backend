const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        level: newUser.level,
        xp: newUser.xp,
        wins: newUser.wins,
        soundEnabled: newUser.soundEnabled
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp,
        wins: user.wins,
        soundEnabled: user.soundEnabled
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
