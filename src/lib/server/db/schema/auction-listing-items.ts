import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { auctionListings } from './auction-listings';
import { assets } from './assets';

export const auctionListingItems = sqliteTable('auction_listing_items', {
	listingId: text('listing_id'),
	assetId: text('asset_id'),
	u3: integer('u3', { mode: 'boolean' }),
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
