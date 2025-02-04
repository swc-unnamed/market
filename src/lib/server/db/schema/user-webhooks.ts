import { createId } from '@paralleldrive/cuid2';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations } from 'drizzle-orm';

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
	webhook: text('webhook').notNull(),
	events: text('events').array().notNull(),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	lastUsed: timestamp('last_used')
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
	successCount: integer('success_count').default(0),
	failureCount: integer('failure_count').default(0)
});

export const userWebhookRelations = relations(userWebhooks, ({ one }) => ({
	user: one(users, {
		fields: [userWebhooks.userId],
		references: [users.id]
	})
}));
