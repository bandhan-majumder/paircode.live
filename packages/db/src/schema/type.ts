import type { room } from "./room";

export type RoomType = typeof room.$inferSelect;
export type RoomInsertType = typeof room.$inferInsert;
export type RoomUpdateType = Partial<RoomInsertType>;