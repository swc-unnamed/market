import { createId } from '../../../helpers/nanoid';
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const holochainIndex = pgTable('holochain_index', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	assetId: text('asset_id').notNull(),
	time: timestamp('time').notNull(),
	price: integer('price').notNull()
});
