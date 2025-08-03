const mongoose = require('mongoose');

const damagePopupSchema = new mongoose.Schema({
  text: String,
  isCritical: Boolean,
  isForPlayer: Boolean,
  timestamp: Date
});

const playerSchema = new mongoose.Schema({
  name: String,
  maxHp: Number,
  currentHp: Number,
  attack: Number,
  defense: Number,
  criticalChance: Number,
  dodgeChance: Number
});

const gameStateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  player: playerSchema,
  ai: playerSchema,
  timeRemaining: Number,
  status: {
    type: String,
    enum: ['playing', 'victory', 'defeat', 'draw'],
    default: 'playing'
  },
  isPlayerTurn: {
    type: Boolean,
    default: true
  },
  damagePopups: [damagePopupSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GameState', gameStateSchema); 