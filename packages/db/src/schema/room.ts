import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const room = pgTable("room", {
    id: uuid().primaryKey().defaultRandom(),
    topic: text("topic").notNull(),
    banner: text("banner"),
    createdBy: text("created_by").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const roomMember = pgTable("room_member", {
    roomId: uuid().notNull().references(() => room.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.roomId, table.userId] }),
    roomIdx: index("room_member_roomId_idx").on(table.roomId),
    userIdx: index("room_member_userId_idx").on(table.userId),
}));

export const roomMemberRelations = relations(roomMember, ({ one }) => ({
    room: one(room, {
        fields: [roomMember.roomId],
        references: [room.id],
    }),
    user: one(user, {
        fields: [roomMember.userId],
        references: [user.id],
    }),
}));

export const roomRelations = relations(room, ({ many, one }) => ({
    members: many(roomMember),
    creator: one(user, {
        fields: [room.createdBy],
        references: [user.id],
    }),
}));