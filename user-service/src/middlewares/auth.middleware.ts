import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { JWT_SECRET } from '../config/env';
import { AppError } from '../utils/AppError';

interface JwtPayload {
    userId: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token using the SHARED secret
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

            // Check if user exists in THIS service's DB
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(401).json({ status: 'fail', message: 'User belonging to this token no longer exists.' });
            }

            // Attach user to request
            req.user = user;
            next();

        } catch (error) {
            res.status(401).json({ status: 'fail', message: 'Not authorized, invalid token' });
        }
    }

    if (!token) {
        res.status(401).json({ status: 'fail', message: 'Not authorized, no token' });
    }
};

export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};