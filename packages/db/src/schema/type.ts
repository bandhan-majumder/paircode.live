import type { room, roomMember } from "./room";
import type { feedback } from "./feedback";
import type { invite } from "./invite";


export type RoomType = typeof room.$inferSelect;
export type RoomInsertType = typeof room.$inferInsert;
export type RoomUpdateType = Partial<RoomInsertType>;

export type FeedBackType = typeof feedback.$inferSelect;
export type FeedBackIntertType = typeof feedback.$inferInsert;

export type InviteType = typeof invite.$inferSelect;
export type InviteInsertType = typeof invite.$inferInsert;

export type RoomMemberType = typeof roomMember.$inferSelect;
export type RoomMemberInsertType = typeof roomMember.$inferInsert;
export type RoomMemberUpdateType = Partial<RoomMemberInsertType>;