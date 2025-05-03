// backend/routes/bottleRoutes.js
import express from 'express';
import { getLeaderboard, getUserPoints } from '../controllers/bottleController.js';

const router = express.Router();

// Leaderboard routes
router.get('/leaderboard', getLeaderboard);
router.get('/user-points/:email', getUserPoints);

export default router;