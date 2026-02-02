import { z } from 'zod';

export const createNoteSchema = z.object({
    body: z.object({
        title: z.string().max(100, "Title too long").optional(),
        content: z.string({ message: "Content is required" }),
        tags: z.array(z.string()).optional(),
        isPinned: z.boolean().optional(),
        isArchived: z.boolean().optional(),
        backgroundColor: z.string().optional()
    })
});

export const updateNoteSchema = z.object({
    body: z.object({
        title: z.string().min(1).optional(),
        content: z.string().optional(),
        tags: z.array(z.string()).optional(),
        isPinned: z.boolean().optional(),
        isArchived: z.boolean().optional(),
        backgroundColor: z.string().optional()
    })
});