const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const GameController = require('../controllers/gameController');

router.use(authMiddleware);

router.post('/initialize', GameController.initializeGame);
router.post('/attack', GameController.playerAttack);
router.post('/skill', GameController.playerSkill);
router.post('/ai-turn', GameController.aiTurn);
router.get('/state', GameController.getGameState);
router.post('/end-game', GameController.endGame);

module.exports = router; 