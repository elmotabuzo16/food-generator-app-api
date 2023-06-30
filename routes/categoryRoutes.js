import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import {
  createCategory,
  getCategory,
  getRelatedCategories,
} from '../controllers/categoryController.js';

const router = express.Router();

router.route('/').get(getCategory).post(createCategory);
router.route('/:slug').get(getRelatedCategories);

export default router;
