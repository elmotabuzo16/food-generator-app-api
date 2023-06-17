import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import { getIngredients } from '../controllers/ingredientController.js';

const router = express.Router();

router.route('/').get(getIngredients);

export default router;
