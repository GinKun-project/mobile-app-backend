const User = require('../models/User');
const GameHistory = require('../models/GameHistory');

const DashboardController = {
  async getUserStats(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const gameHistory = await GameHistory.find({ userId }).sort({ timestamp: -1 }).limit(5);
      const totalGames = await GameHistory.countDocuments({ userId });
      const victories = await GameHistory.countDocuments({ userId, result: 'victory' });
      const winRate = totalGames > 0 ? Math.round((victories / totalGames) * 100) : 0;

      const stats = {
        playerName: user.username,
        playerLevel: user.level || 85,
        playerXp: user.xp || 1200,
        playerWins: user.wins || 42,
        isSoundEnabled: user.soundEnabled !== false,
        showNotification: false,
        totalGames,
        winRate,
        recentGames: gameHistory
      };

      res.json(stats);
    } catch (error) {
      console.error('Error getting user stats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateUserStats(req, res) {
    try {
      const userId = req.user.id;
      const { level, xp, wins } = req.body;

      const updateData = {};
      if (level !== undefined) updateData.level = level;
      if (xp !== undefined) updateData.xp = xp;
      if (wins !== undefined) updateData.wins = wins;

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ 
        message: 'Stats updated successfully',
        user: {
          level: user.level,
          xp: user.xp,
          wins: user.wins
        }
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getGameHistory(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10, page = 1 } = req.query;
      
      const skip = (page - 1) * limit;
      const history = await GameHistory.find({ userId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await GameHistory.countDocuments({ userId });

      res.json({
        history,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalGames: total
        }
      });
    } catch (error) {
      console.error('Error getting game history:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async saveGameResult(req, res) {
    try {
      const userId = req.user.id;
      const { result, playerHp, enemyHp, duration } = req.body;

      const gameResult = new GameHistory({
        userId,
        result,
        playerHp,
        enemyHp,
        duration,
        timestamp: new Date()
      });

      await gameResult.save();

      if (result === 'victory') {
        await User.findByIdAndUpdate(userId, {
          $inc: { wins: 1, xp: 50 }
        });
      } else if (result === 'defeat') {
        await User.findByIdAndUpdate(userId, {
          $inc: { xp: 10 }
        });
      }

      res.json({ 
        message: 'Game result saved',
        gameResult
      });
    } catch (error) {
      console.error('Error saving game result:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateSoundSettings(req, res) {
    try {
      const userId = req.user.id;
      const { isEnabled } = req.body;

      const user = await User.findByIdAndUpdate(userId, {
        soundEnabled: isEnabled
      }, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ 
        message: 'Sound settings updated',
        soundEnabled: user.soundEnabled
      });
    } catch (error) {
      console.error('Error updating sound settings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = DashboardController; 