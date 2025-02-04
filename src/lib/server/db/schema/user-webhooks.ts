import { createId } from '@paralleldrive/cuid2';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userWebhooks = pgTable('user_webhooks', {
	id: text('id')
		.primaryKey()
		.unique()
		.$defaultFn(() => createId()),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	type: text('type', { enum: ['discord'] })
		.notNull()
		.default('discord'),
	webhook: text('webhook').notNull()
});
