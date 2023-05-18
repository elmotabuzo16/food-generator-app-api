import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import { createTag, getTags } from '../controllers/tagController.js';

const router = express.Router();

router.route('/').get(getTags).post(protect, admin, createTag);

export default router;
