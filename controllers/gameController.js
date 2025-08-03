const GameState = require('../models/GameState');

const GameController = {
  async initializeGame(req, res) {
    try {
      const userId = req.user.id;
      
      const existingGame = await GameState.findOne({ userId, status: 'playing' });
      if (existingGame) {
        return res.json(existingGame);
      }

      const gameState = new GameState({
        userId,
        player: {
          name: 'Player',
          maxHp: 1200,
          currentHp: 1200,
          attack: 140,
          defense: 90,
          criticalChance: 0.18,
          dodgeChance: 0.12
        },
        ai: {
          name: 'ENEMY',
          maxHp: 1200,
          currentHp: 1200,
          attack: 160,
          defense: 100,
          criticalChance: 0.22,
          dodgeChance: 0.15
        },
        timeRemaining: 180,
        status: 'playing',
        isPlayerTurn: true,
        damagePopups: []
      });

      await gameState.save();
      res.json(gameState);
    } catch (error) {
      console.error('Error initializing game:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async playerAttack(req, res) {
    try {
      const userId = req.user.id;
      const gameState = await GameState.findOne({ userId, status: 'playing' });
      
      if (!gameState) {
        return res.status(404).json({ message: 'No active game found' });
      }

      if (!gameState.isPlayerTurn) {
        return res.status(400).json({ message: 'Not player turn' });
      }

      const baseDamage = gameState.player.attack;
      const enemyDefense = gameState.ai.defense;
      const damage = Math.max(10, Math.floor((baseDamage - enemyDefense * 0.5) * (0.8 + Math.random() * 0.4)));
      const isCritical = Math.random() < gameState.player.criticalChance;
      const finalDamage = isCritical ? Math.floor(damage * 1.8) : damage;

      gameState.ai.currentHp = Math.max(0, gameState.ai.currentHp - finalDamage);
      gameState.isPlayerTurn = false;
      gameState.damagePopups.push({
        text: isCritical ? `-${finalDamage} CRIT!` : `-${finalDamage}`,
        isCritical,
        isForPlayer: false,
        timestamp: new Date()
      });

      if (gameState.ai.currentHp <= 0) {
        gameState.status = 'victory';
      }

      await gameState.save();
      res.json(gameState);
    } catch (error) {
      console.error('Error processing player attack:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async playerSkill(req, res) {
    try {
      const userId = req.user.id;
      const gameState = await GameState.findOne({ userId, status: 'playing' });
      
      if (!gameState) {
        return res.status(404).json({ message: 'No active game found' });
      }

      if (!gameState.isPlayerTurn) {
        return res.status(400).json({ message: 'Not player turn' });
      }

      const baseDamage = gameState.player.attack * 1.5;
      const enemyDefense = gameState.ai.defense;
      const damage = Math.max(20, Math.floor((baseDamage - enemyDefense * 0.3) * (0.9 + Math.random() * 0.2)));
      const isCritical = Math.random() < gameState.player.criticalChance;
      const finalDamage = isCritical ? Math.floor(damage * 2.2) : damage;

      gameState.ai.currentHp = Math.max(0, gameState.ai.currentHp - finalDamage);
      gameState.isPlayerTurn = false;
      gameState.damagePopups.push({
        text: isCritical ? `-${finalDamage} SKILL CRIT!` : `-${finalDamage} SKILL`,
        isCritical,
        isForPlayer: false,
        timestamp: new Date()
      });

      if (gameState.ai.currentHp <= 0) {
        gameState.status = 'victory';
      }

      await gameState.save();
      res.json(gameState);
    } catch (error) {
      console.error('Error processing player skill:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async aiTurn(req, res) {
    try {
      const userId = req.user.id;
      const gameState = await GameState.findOne({ userId, status: 'playing' });
      
      if (!gameState) {
        return res.status(404).json({ message: 'No active game found' });
      }

      if (gameState.isPlayerTurn) {
        return res.status(400).json({ message: 'Still player turn' });
      }

      const baseDamage = gameState.ai.attack;
      const playerDefense = gameState.player.defense;
      const damage = Math.max(8, Math.floor((baseDamage - playerDefense * 0.5) * (0.8 + Math.random() * 0.4)));
      const isCritical = Math.random() < gameState.ai.criticalChance;
      const finalDamage = isCritical ? Math.floor(damage * 1.8) : damage;

      gameState.player.currentHp = Math.max(0, gameState.player.currentHp - finalDamage);
      gameState.isPlayerTurn = true;
      gameState.damagePopups.push({
        text: isCritical ? `-${finalDamage} CRIT!` : `-${finalDamage}`,
        isCritical,
        isForPlayer: true,
        timestamp: new Date()
      });

      if (gameState.player.currentHp <= 0) {
        gameState.status = 'defeat';
      }

      await gameState.save();
      res.json(gameState);
    } catch (error) {
      console.error('Error processing AI turn:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getGameState(req, res) {
    try {
      const userId = req.user.id;
      const gameState = await GameState.findOne({ userId, status: 'playing' });
      
      if (!gameState) {
        return res.status(404).json({ message: 'No active game found' });
      }

      res.json(gameState);
    } catch (error) {
      console.error('Error getting game state:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async endGame(req, res) {
    try {
      const userId = req.user.id;
      const { result } = req.body;
      
      await GameState.updateMany(
        { userId, status: 'playing' },
        { status: result }
      );

      res.json({ message: 'Game ended successfully' });
    } catch (error) {
      console.error('Error ending game:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = GameController; 