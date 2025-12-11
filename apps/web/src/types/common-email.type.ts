import { z } from 'zod';

export const commonMailSchema = z.object({
    receiverEmail: z.email().optional(),
    senderName: z.string().nonempty(),
    subject: z.string().nonempty(),
    body: z.string().nonempty(),
});

export type commonMailSchemaType = z.infer<typeof commonMailSchema>;