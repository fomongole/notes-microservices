import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IAuthUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    role: 'user' | 'admin';
    isActive: boolean;
    passwordResetToken?: string;
    passwordResetExpires?: Date;

    comparePassword(candidate: string): Promise<boolean>;
    createPasswordResetToken(): string;

    createdAt: Date;
    updatedAt: Date;
}

const authUserSchema = new Schema<IAuthUser>({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true, select: false },
    passwordResetToken: String,
    passwordResetExpires: Date
}, { timestamps: true });

authUserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

authUserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

authUserSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
};

export const User = model<IAuthUser>('User', authUserSchema);