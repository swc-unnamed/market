import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { assetLedger } from './asset-ledger';
import { entities } from './entities';

/**
 * Represents a 'physical' asset in game.
 */
export const assets = pgTable('assets', {
	id: text('id')
		.primaryKey()
		.unique()
		.$defaultFn(() => createId()),
	entityId: text('entity_id'),
	combineId: integer('combine_id').notNull(),
	typeId: integer().notNull(),
	type: text().notNull(),
	customImageUrl: text('custom_image_url')
});

export const assetRelations = relations(assets, ({ many, one }) => ({
	ledger: many(assetLedger),
	entity: one(entities, {
		fields: [assets.entityId],
		references: [entities.id]
	})
}));
