import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import * as AuthService from '../services/auth.service';
import { User } from '../models/user.model';
import { AppError } from '../utils/AppError';
import generateToken from "../utils/generateToken";
import sendEmail from "../utils/sendEmail";
import { getPasswordResetTemplate } from '../utils/emailTemplates';
import { CLIENT_URL, USER_SERVICE_URL } from "../config/env";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    let newUser;
    try {
        // 1. Create Identity in Auth DB (Email, Password, Role)
        newUser = await AuthService.createUser({
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'user'
        });

        // 2. Call User Service to create Profile (Username, Bio, Avatar)
        // We pass the SAME _id to link them.
        try {
            await axios.post(USER_SERVICE_URL, {
                _id: newUser._id,
                email: newUser.email,
                username: req.body.username,
                bio: req.body.bio,
                avatar: req.body.avatar
            });
        } catch (microserviceError) {
            // ROLLBACK: If User Service fails, delete the Auth Identity
            await User.findByIdAndDelete(newUser._id);
            console.error('Failed to sync with User Service:', microserviceError);
            throw new AppError('Failed to create user profile. Please try again.', 500);
        }

        // 3. Success
        const token = generateToken(newUser._id.toString());
        res.status(201).json({ status: 'success', token });
    } catch (error: any) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await AuthService.validateUser(req.body.email, req.body.password);
        const token = generateToken(user._id.toString());

        res.json({ status: 'success', token });
    } catch (error: any) {
        next(new AppError(error.message, 401));
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resetToken = await AuthService.getResetToken(req.body.email);
        const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

        try {
            await sendEmail({
                email: req.body.email,
                subject: 'Your Password Reset Token (Valid for 10 min)',
                message: `Reset your password here: ${resetUrl}`,
                html: getPasswordResetTemplate(resetUrl)
            });

            res.status(200).json({ status: 'success', message: 'Token sent to email!' });
        } catch (emailError) {
            await AuthService.clearResetToken(req.body.email);
            return next(new AppError('There was an error sending the email. Try again later!', 500));
        }
    } catch (error: any) {
        next(new AppError(error.message, 404));
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await AuthService.resetPassword(req.params.token as string, req.body.password);
        const token = generateToken(user._id.toString());
        res.status(200).json({ status: 'success', token });
    } catch (error: any) {
        next(new AppError(error.message, 400));
    }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await AuthService.updatePassword(
            (req as any).user._id,
            req.body.currentPassword,
            req.body.newPassword
        );
        const token = generateToken(user._id.toString());
        res.status(200).json({ status: 'success', token });
    } catch (error: any) {
        next(new AppError(error.message, 401));
    }
};