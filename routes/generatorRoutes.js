import express from 'express';
import { incrementGeneratorClicks } from '../controllers/generatorController.js';

const router = express.Router();

router.route('/').get(incrementGeneratorClicks);

export default router;
