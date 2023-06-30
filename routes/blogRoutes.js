import express from 'express';
import {
  createBlog,
  listBlog,
  readSingleBLog,
} from '../controllers/blogController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(listBlog).post(protect, admin, createBlog);
router.route('/:slug').get(readSingleBLog);

export default router;
