import { z } from 'zod';

export const updateMeSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters").optional(),
        bio: z.string().max(250, "Bio cannot exceed 250 characters").optional(),
        avatar: z.string().url("Avatar must be a valid URL").optional()
    })
});