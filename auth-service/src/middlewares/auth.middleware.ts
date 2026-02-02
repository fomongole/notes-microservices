import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { JWT_SECRET } from '../config/env';
import {AppError} from "../utils/AppError"; // Import secret from env config for consistency

// FIX 1: Update interface to match the token payload
interface JwtPayload {
    userId: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

            // FIX 2: Use 'decoded.userId' instead of 'decoded.id'
            req.user = await User.findById(decoded.userId).select('-password') || undefined;

            if (!req.user) {
                return res.status(401).json({ status: 'fail', message: 'User not found' });
            }

            next();
        } catch (error) {
            console.error(error); // Optional: log error for debugging
            res.status(401).json({ status: 'fail', message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ status: 'fail', message: 'Not authorized, no token' });
    }
};

/**
 * Middleware to restrict access based on User Role.
 * Pass the allowed roles as arguments (e.g., 'admin').
 */
export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // req.user is guaranteed by 'protect' middleware
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};