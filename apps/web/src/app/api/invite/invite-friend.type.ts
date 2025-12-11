import { z } from 'zod';

export const inviteFriendSchema = z.object({
    receiverEmail: z.email().nonempty(),
    senderEmail: z.email().nonempty(),
    roomId: z.string().nonempty(),
    senderName: z.string().nonempty(),
});

export type inviteFriendSchemaType = z.infer<typeof inviteFriendSchema>;