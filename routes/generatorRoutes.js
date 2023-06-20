import express from 'express';
import {
  incrementGeneratorClicks,
  incrementHomePageViews,
} from '../controllers/generatorController.js';

const router = express.Router();

router.route('/').get(incrementGeneratorClicks);
router.route('/pageViews').get(incrementHomePageViews);

export default router;
