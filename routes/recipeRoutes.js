import express from 'express';
import {
  createFood,
  createRecipeReview,
  getApprovedRecipes,
  getNonApprovedRecipes,
  getRecipeById,
  approvedRecipe,
  listByUser,
  addToFavorites,
  listFavoritesByUser,
  listRelatedCategory,
  getFeatured,
} from '../controllers/recipeController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/getFeatured', getFeatured);
router.route('/relatedCategory').post(listRelatedCategory);
router.route('/').get(getApprovedRecipes).post(protect, createFood);
router.get('/userfavorites', protect, listFavoritesByUser);
router.route('/admin/:slug/approved').put(protect, admin, approvedRecipe);
router.route('/admin').get(protect, admin, getNonApprovedRecipes);
router.route('/:slug/reviews').post(protect, createRecipeReview);
router.route('/:slug').get(getRecipeById);
router.get('/user/:username', listByUser);
router.route('/favorite').put(protect, addToFavorites);

export default router;
