import { createId } from '../../../helpers/nanoid';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { assets } from './assets';
import { AssetChainAction } from '../../../consts/asset-chain-action';
import { relations } from 'drizzle-orm/relations';

/**
 * Represents the history of an asset.
 */
export const assetLedger = pgTable('asset_ledger', {
	id: text('id')
		.primaryKey()
		.unique()
		.$defaultFn(() => createId()),
	assetId: text('asset_id')
		.notNull()
		.references(() => assets.id),
	action: text('action', { enum: AssetChainAction }).notNull(),
	listedPrice: integer('listed_price'),
	soldPrice: integer('sold_price'),
	time: timestamp('time').$defaultFn(() => new Date())
});

export const assetLedgerRelations = relations(assetLedger, ({ one }) => ({
	asset: one(assets, {
		fields: [assetLedger.assetId],
		references: [assets.id]
	})
}));
