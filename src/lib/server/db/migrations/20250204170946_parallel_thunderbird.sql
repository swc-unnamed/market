ALTER TABLE "user_webhooks" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "user_webhooks" ADD COLUMN "last_used" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "user_webhooks" ADD COLUMN "success_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user_webhooks" ADD COLUMN "failure_count" integer DEFAULT 0;