ALTER TABLE "users" ADD COLUMN "refreshToken" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token_expires" bigint;