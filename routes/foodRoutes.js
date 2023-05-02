import express from 'express';
import {
  createFood,
  createRecipeReview,
  getRecipeById,
  getRecipes,
} from '../controllers/foodController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getRecipes).post(protect, admin, createFood);
router.route('/:slug/reviews').post(protect, createRecipeReview);
router.route('/:slug').get(getRecipeById);

export default router;
