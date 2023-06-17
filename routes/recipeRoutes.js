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
  updateFood,
  getRecipeByIdTags,
  getFoodTags,
  filterRecipes,
} from '../controllers/recipeController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/favorite').put(protect, addToFavorites);
router.route('/foodTags').get(getFoodTags);
router.route('/filter').get(filterRecipes);
router.post('/getFeatured', getFeatured);
router.route('/relatedCategory').post(listRelatedCategory);
router.route('/').get(getApprovedRecipes).post(protect, createFood);
router.get('/userfavorites', protect, listFavoritesByUser);
router.route('/admin/:slug/approved').put(protect, admin, approvedRecipe);
router.route('/admin').get(protect, admin, getNonApprovedRecipes);
router.route('/:slug/reviews').post(protect, createRecipeReview);
router.route('/:slug').get(getRecipeById).put(updateFood);
router.route('/:slug/tag').get(getRecipeByIdTags);
router.get('/user/:username', listByUser);

export default router;
