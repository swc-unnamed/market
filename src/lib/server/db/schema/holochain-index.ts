import { createId } from '../../../helpers/nanoid';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const holochainIndex = sqliteTable('holochain_index', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	assetId: text('asset_id').notNull(),
	time: integer('time', { mode: 'timestamp' }).notNull(),
	price: integer('price').notNull()
});
