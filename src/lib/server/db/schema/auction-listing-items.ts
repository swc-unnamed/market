import { relations } from 'drizzle-orm';
import { auctionListings } from './auction-listings';
import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, integer, boolean } from 'drizzle-orm/pg-core';
import { assets } from './assets';
import { entities } from './entities';

/**
 * Represents a listing item in an auction.
 */
export const auctionListingItems = pgTable('auction_listing_items', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	listingId: text('listing_id')
		.notNull()
		.references(() => auctionListings.id),
	assetId: text('asset_id').references(() => assets.id),
	entityId: text('entity_id'),
	uuu: boolean('uuu'),
	quantity: integer('quantity').default(1),
	customItem: boolean('custom_item').default(false),
	customImageUrl: text('custom_image_url'),
	customItemName: text('custom_item_name'),
	uniqueItem: boolean('unique_item').default(false)
});

export const auctionListingItemsRelations = relations(auctionListingItems, ({ one }) => ({
	asset: one(assets, {
		fields: [auctionListingItems.assetId],
		references: [assets.id]
	}),
	listing: one(auctionListings, {
		fields: [auctionListingItems.listingId],
		references: [auctionListings.id]
	}),
	entity: one(entities, {
		fields: [auctionListingItems.entityId],
		references: [entities.id]
	})
}));
