import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import { createTag, getTags } from '../controllers/tagController.js';
import { uploadImage } from '../controllers/uploadController.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.post('/', uploadImage);

export default router;
