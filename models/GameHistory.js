const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  result: {
    type: String,
    enum: ['victory', 'defeat', 'draw'],
    required: true
  },
  playerHp: Number,
  enemyHp: Number,
  duration: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GameHistory', gameHistorySchema); 