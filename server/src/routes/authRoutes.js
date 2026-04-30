import express from 'express';
import { registerUser, loginUser, logoutUser, getMe, getAllUsers } from '../controllers/authController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.get('/users', protect, getAllUsers);

export default router;
