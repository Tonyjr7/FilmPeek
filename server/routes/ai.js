import express from 'express';
import { aiMovieMatch, recommendationExplanation } from '../controllers/ai.js';

const router = express.Router();

router.post('/match', aiMovieMatch);
router.post('/explain', recommendationExplanation);

export default router;
