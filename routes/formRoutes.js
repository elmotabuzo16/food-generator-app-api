import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { contactBlogAuthorForm } from '../controllers/formController.js';

const router = express.Router();

router.route('/contact').post(contactBlogAuthorForm);

export default router;
