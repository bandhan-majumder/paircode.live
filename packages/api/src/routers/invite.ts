import { db } from "@paircode/db";
import { invite } from "@paircode/db/schema/invite";
import { env } from "@paircode/env/web";
import nodemailer from "nodemailer";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, rateLimitedProtectedProcedure } from "../index";

const sendInviteSchema = z.object({
  receiverEmail: z.string().email(),
  roomId: z.string().uuid(),
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.USER_EMAIL || "",
    pass: env.USER_EMAIL_PASS || "",
  },
});

export const inviteRouter = router({
  send: rateLimitedProtectedProcedure({ windowMs: 1 * 60 * 1000, max: 5 })
    .input(sendInviteSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      
      if (!user.name || !user.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User profile incomplete",
        });
      }

      const senderName = user.name;
      const senderEmail = user.email;
      const { receiverEmail, roomId } = input;

      const emailText = `${senderName} - (${senderEmail}) has invited you to join a pair coding session. Click the link below to join:\n\nhttps://paircode.live/room/${roomId}`;
      const emailSubject = `PairCode Join Request from ${senderName}`;

      try {
        // Send email
        await transporter.sendMail({
          from: `<${env.USER_EMAIL_ALIAS || env.USER_EMAIL || ""}>`,
          to: [receiverEmail],
          subject: emailSubject,
          text: emailText,
        });

        // Save invite to database
        const newInvite = await db
          .insert(invite)
          .values({
            senderName,
            senderEmail,
            receiverEmail,
            roomId,
          })
          .returning({
            id: invite.id,
            senderName: invite.senderName,
            senderEmail: invite.senderEmail,
            receiverEmail: invite.receiverEmail,
            roomId: invite.roomId,
            createdAt: invite.createdAt,
          });

        if (!newInvite[0]) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to save invite",
          });
        }

        return {
          message: "Invite sent successfully",
          invite: newInvite[0],
        };
      } catch (error) {
        console.error("Error sending invite:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send invite",
        });
      }
    }),
});
