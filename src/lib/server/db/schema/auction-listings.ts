import { createId } from '@paralleldrive/cuid2';
import { is, relations } from 'drizzle-orm';
import { users } from './users';
import { auctionListingItems } from './auction-listing-items';
import { auctionListingHistory } from './auction-listing-history';
import { AuctionListingStatus } from '../../../consts/auction-listing-status';
import { pgTable, text, integer, serial, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { auctions } from './auctions';

/**
 * Represents a listing in an auction.
 */
export const auctionListings = pgTable('auction_listings', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	listingNumber: serial('listing_number'),
	listedById: text('listed_by_id').references(() => users.id),
	startingPrice: integer('starting_price'),
	purchasedById: text('purchased_by_id').references(() => users.id),
	purchasedPrice: integer('purchased_price'),
	title: text('title').notNull(),
	description: text('description'),
	location: text('location'),
	sendCreditsTo: text('sent_credits_to_id'),
	listerIsAnon: boolean('lister_is_anon').notNull().default(false),
	createdAt: timestamp('created_at')
		.$defaultFn(() => new Date())
		.notNull(),
	status: text('status', { enum: AuctionListingStatus }).default('draft').notNull(),
	auctionId: text('auction_id').references(() => auctions.id),
	isDeleted: boolean('is_deleted').default(false),
	deletedAt: timestamp('deleted_at')
});

export const auctionListingsRelations = relations(auctionListings, ({ many, one }) => ({
	items: many(auctionListingItems),
	history: many(auctionListingHistory),
	listedBy: one(users, {
		fields: [auctionListings.listedById],
		references: [users.id]
	}),
	auction: one(auctions, {
		fields: [auctionListings.auctionId],
		references: [auctions.id]
	}),
	purchasedBy: one(users, {
		fields: [auctionListings.purchasedById],
		references: [users.id]
	})
}));
