import { createId } from '../../../helpers/nanoid';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { auctionListingItems } from './auction-listing-items';
import { auctionListingHistory } from './auction-listing-history';
import { AuctionListingStatus } from '../../../consts/auction-listing-status';
import { pgTable, text, integer, serial, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const auctionListings = pgTable('auction_listings', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	listingNumber: serial('listing_number'),
	listedBy: text('listed_by_id').references(() => users.id),
	startingPrice: text('starting_price'),
	purchasedBy: text('purchased_by_id').references(() => users.id),
	purchasedPrice: integer('purchased_price'),
	title: text('title'),
	description: text('description'),
	location: text('location'),
	sendCreditsTo: text('sent_credits_to_id').notNull(),
	listerIsAnon: boolean('lister_is_anon'),
	createdAt: timestamp('created_at').$defaultFn(() => new Date()),
	status: text('status', { enum: AuctionListingStatus }).default('new')
});

export const auctionListingsRelations = relations(auctionListings, ({ many, one }) => ({
	items: many(auctionListingItems),
	history: many(auctionListingHistory),
	listedBy: one(users, {
		fields: [auctionListings.listedBy],
		references: [users.id]
	})
}));
