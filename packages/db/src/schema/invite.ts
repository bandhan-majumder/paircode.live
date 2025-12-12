import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { room } from "./room";

export const invite = pgTable("invite", {
    id: serial("id").primaryKey(),
    senderName: text("sender_name").notNull(),
    senderEmail: text("sender_email").notNull(),
    receiverEmail: text("receiver_email").notNull(),
    roomId: uuid("room_id")
        .notNull()
        .references(() => room.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => [
    index("invite_senderEmail_idx").on(table.senderEmail),
    index("invite_receiverEmail_idx").on(table.receiverEmail),
    index("invite_roomId_idx").on(table.roomId),
]);

export const inviteRelations = relations(invite, ({ one }) => ({
    sender: one(user, {
        fields: [invite.senderEmail],
        references: [user.email],
    }),
    room: one(room, {
        fields: [invite.roomId],
        references: [room.id],
    }),
}));