CREATE TABLE "invite" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_name" text NOT NULL,
	"sender_email" text NOT NULL,
	"receiver_email" text NOT NULL,
	"room_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invite" ADD CONSTRAINT "invite_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invite_senderEmail_idx" ON "invite" USING btree ("sender_email");--> statement-breakpoint
CREATE INDEX "invite_receiverEmail_idx" ON "invite" USING btree ("receiver_email");--> statement-breakpoint
CREATE INDEX "invite_roomId_idx" ON "invite" USING btree ("room_id");