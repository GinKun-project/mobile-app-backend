const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const DashboardController = require('../controllers/dashboardController');

router.use(authMiddleware);

router.get('/stats', DashboardController.getUserStats);
router.put('/stats', DashboardController.updateUserStats);
router.get('/game-history', DashboardController.getGameHistory);
router.post('/game-result', DashboardController.saveGameResult);
router.put('/sound-settings', DashboardController.updateSoundSettings);

module.exports = router; 