import { Router } from 'express';
import {
    register,
    login,
    forgotPassword,
    resetPassword,
    updatePassword
} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updatePasswordSchema
} from '../validators/auth.validator';

const router = Router();

// Public Routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.patch('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

// Protected Routes
router.patch('/update-password', protect, validate(updatePasswordSchema), updatePassword);

export default router;