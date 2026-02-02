import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    username?: string;
    bio?: string;
    avatar?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    // We strictly define _id requirements if we want to be explicit,
    // but Mongoose allows overriding _id by default on create().
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, trim: true },
    bio: { type: String, maxlength: 250, default: null },
    avatar: { type: String, default: null },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true, select: false }
}, {
    timestamps: true
});

// QUERY MIDDLEWARE: Hide inactive users
userSchema.pre(/^find/, function(this: any, next) {
    if (!this.getOptions().skipInactive) {
        this.find({ isActive: { $ne: false } });
    }
});

export const User = model<IUser>('User', userSchema);