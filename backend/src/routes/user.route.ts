import express from 'express';
import { authenticationToken } from '../middleware/auth.middleware';
import { updateUserProfile } from '../controllers/user.controller';

const router = express.Router();

// @route   PATCH /api/user/profile
// @desc    Update user name and email
// @access  Private
router.patch('/profile', authenticationToken, updateUserProfile);

export default router;