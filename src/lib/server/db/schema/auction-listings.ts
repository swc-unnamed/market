import { assets } from './assets';
import { createId } from '../../../helpers/nanoid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { auctionListingItems } from './auction-listing-items';

export const auctionListings = sqliteTable('auction_listings', {
	id: text('id')
		.unique()
		.$defaultFn(() => createId()),
	listingNumber: integer('listing_number').primaryKey({ autoIncrement: true }),
	listedBy: text('listed_by_id').references(() => users.id),
	startingPrice: text('starting_price'),
	purchasedBy: text('purchased_by_id').references(() => users.id),
	purchasedPrice: integer('purchased_price'),
	title: text('title'),
	description: text('description'),
	location: text('location'),
	sendCreditsTo: text('sent_credits_to_id').notNull(),
	listerIsAnon: integer('lister_is_anon', { mode: 'boolean' })
});

export const auctionListingsRelations = relations(auctionListings, ({ many }) => ({
	assets: many(auctionListingItems)
}));
