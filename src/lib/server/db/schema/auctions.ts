import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { auctionListings } from './auction-listings';
import { users } from './users';

export const auctions = pgTable('auctions', {
	id: text('id')
		.primaryKey()
		.unique()
		.$defaultFn(() => createId()),
	createdById: text('created_by_id')
		.notNull()
		.references(() => users.id),
	title: text('title').notNull(),
	startAt: timestamp('start_at').notNull(),
	completedAt: timestamp('completed_at')
});

export const auctionRelations = relations(auctions, ({ many, one }) => ({
	listings: many(auctionListings),
	createdBy: one(users, {
		fields: [auctions.createdById],
		references: [users.id]
	})
}));
