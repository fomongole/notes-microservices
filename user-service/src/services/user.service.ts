import { User, IUser } from '../models/user.model';

/**
 * INTERNAL: Creates a user profile.
 * CALLED BY: Auth Service (via Internal Route)
 * CRITICAL: We accept a specific '_id' to ensure Auth and User DBs are linked.
 */
export const createProfile = async (data: Partial<IUser> & { _id: string }) => {
    return await User.create(data);
};

export const getMe = async (userId: string) => {
    return await User.findById(userId);
};

export const updateMe = async (userId: string, updateData: Partial<IUser>) => {
    // Whitelist allowed fields
    const allowedFields = {
        username: updateData.username,
        bio: updateData.bio,
        avatar: updateData.avatar
    };

    // Remove undefined keys
    Object.keys(allowedFields).forEach(key =>
        (allowedFields as any)[key] === undefined && delete (allowedFields as any)[key]
    );

    return await User.findByIdAndUpdate(userId, allowedFields, {
        new: true,
        runValidators: true
    });
};

export const deleteMe = async (userId: string) => {
    await User.findByIdAndUpdate(userId, { isActive: false });
};

// --- ADMIN SERVICES ---

export const getAllUsers = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    // Use .setOptions({ skipInactive: true }) to see deleted users
    const users = await User.find()
        .setOptions({ skipInactive: true })
        .skip(skip)
        .limit(limit)
        .select('+isActive');

    const total = await User.countDocuments().setOptions({ skipInactive: true });

    return {
        users,
        total,
        page,
        pages: Math.ceil(total / limit)
    };
};

export const getUserById = async (id: string) => {
    const user = await User.findById(id).setOptions({ skipInactive: true });
    if (!user) throw new Error('No user found with that ID');
    return user;
};

export const updateUserById = async (id: string, updateData: Partial<IUser>) => {
    // Admin can update roles or status here if needed
    const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
    if (!user) throw new Error('No user found with that ID');
    return user;
};

export const deleteUserById = async (id: string) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error('No user found with that ID');
    return user;
};