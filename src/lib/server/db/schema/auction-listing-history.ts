import { createId } from '@paralleldrive/cuid2';
import { auctionListings } from './auction-listings';
import { AuctionListingEvents } from '../../../consts/auction-listing-events';
import { relations } from 'drizzle-orm';
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const auctionListingHistory = pgTable('auction_listing_history', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	listingId: text('listing_id')
		.notNull()
		.references(() => auctionListings.id),
	event: text('event', { enum: AuctionListingEvents }).notNull(),
	message: text('message').notNull(),
	time: timestamp('time').$defaultFn(() => new Date())
});

export const auctionListingHistoryRelations = relations(auctionListingHistory, ({ one }) => ({
	listing: one(auctionListings, {
		fields: [auctionListingHistory.listingId],
		references: [auctionListings.id]
	})
}));
