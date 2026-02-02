import { User, IAuthUser } from '../models/user.model';
import crypto from 'crypto';

export const createUser = async (userData: Partial<IAuthUser>) => {
    // Mongoose handles unique email error (code 11000)
    return await User.create(userData);
};

export const validateUser = async (email: string, pass: string) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(pass))) {
        throw new Error('Invalid email or password');
    }
    return user;
};

export const getResetToken = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    return resetToken;
};

export const resetPassword = async (token: string, newPass: string) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new Error('Token is invalid or has expired');
    }

    user.password = newPass;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    return user;
};

export const updatePassword = async (userId: string, currentPass: string, newPass: string) => {
    const user = await User.findById(userId).select('+password');

    if (!user) throw new Error('User not found');

    if (!(await user.comparePassword(currentPass))) {
        throw new Error('Incorrect current password');
    }

    user.password = newPass;
    await user.save();

    return user;
};

export const clearResetToken = async (email: string) => {
    await User.updateOne(
        { email },
        {
            $unset: {
                passwordResetToken: 1,
                passwordResetExpires: 1
            }
        }
    );
};