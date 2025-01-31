import { createId } from '@paralleldrive/cuid2';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const systemSettings = pgTable('system_settings', {
	id: text('id')
		.primaryKey()
		.unique()
		.$defaultFn(() => createId()),
	auctionWebhookUrl: text('auction_webhook_url')
});
