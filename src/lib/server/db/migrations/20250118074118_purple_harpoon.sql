ALTER TABLE "holochain_index" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "holochain_index" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'Patron';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "discord_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banned_reason" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_discord_id_unique" UNIQUE("discord_id");