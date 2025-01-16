import { createId } from '../../../helpers/nanoid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { auctionListings } from './auction-listings';
import { AuctionListingEvents } from '../../../consts/auction-listing-events';
import { relations } from 'drizzle-orm';

export const auctionListingHistory = sqliteTable('auction_listing_history', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	listingId: text('listing_id')
		.notNull()
		.references(() => auctionListings.id),
	event: text('event', { enum: AuctionListingEvents }).notNull(),
	message: text('message').notNull(),
	time: integer('time', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const auctionListingHistoryRelations = relations(auctionListingHistory, ({ one }) => ({
	listing: one(auctionListings, {
		fields: [auctionListingHistory.listingId],
		references: [auctionListings.id]
	})
}));
