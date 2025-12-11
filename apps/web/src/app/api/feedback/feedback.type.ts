import { z } from 'zod';

export const feedBackFormSchema = z.object({
    category: z.enum(['Bug Report', 'Feature Request', 'General Feedback', 'Other']),
    email: z.email().nonempty(),
    name: z.string().nonempty(),
    message: z.string().nonempty(),
});

export type feedBackFormType = z.infer<typeof feedBackFormSchema>;