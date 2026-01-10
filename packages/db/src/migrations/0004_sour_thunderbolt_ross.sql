DROP INDEX "room_member_roomId_idx";--> statement-breakpoint
DROP INDEX "room_member_userId_idx";--> statement-breakpoint
ALTER TABLE "room_member" DROP CONSTRAINT "room_member_roomId_user_id_pk";--> statement-breakpoint
ALTER TABLE "room" ALTER COLUMN "is_full" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "room_member" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "room_member" ADD COLUMN "left_at" timestamp;