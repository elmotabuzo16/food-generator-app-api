import express from 'express';
import {
  createFood,
  createRecipeReview,
  getApprovedRecipes,
  getNonApprovedRecipes,
  getRecipeById,
  approvedRecipe,
  listByUser,
} from '../controllers/recipeController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getApprovedRecipes).post(protect, createFood);
router.route('/admin/:slug/approved').put(protect, admin, approvedRecipe);
router.route('/admin').get(protect, admin, getNonApprovedRecipes);
router.route('/:slug/reviews').post(protect, createRecipeReview);
router.route('/:slug').get(getRecipeById);
router.get('/user/:username', listByUser);

export default router;
