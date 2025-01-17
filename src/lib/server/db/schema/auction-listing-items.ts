import { relations } from 'drizzle-orm';
import { auctionListings } from './auction-listings';
import { assets } from './assets';
import { createId } from '../../../helpers/nanoid';
import { pgTable, text, integer, boolean } from 'drizzle-orm/pg-core';

export const auctionListingItems = pgTable('auction_listing_items', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	listingId: text('listing_id'),
	assetId: text('asset_id'),
	u3: boolean('u3'),
	quantity: integer('quantity'),
	customImageUrl: text('custom_image_url')
});

export const auctionListingItemsRelations = relations(auctionListingItems, ({ one }) => ({
	item: one(assets, {
		fields: [auctionListingItems.assetId],
		references: [assets.id]
	}),
	listing: one(auctionListings, {
		fields: [auctionListingItems.listingId],
		references: [auctionListings.id]
	})
}));
