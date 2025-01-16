import { createId } from '../../../helpers/nanoid';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const assets = sqliteTable('assets', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text('name').notNull(),
	type: text('type').notNull(),
	uid: text('uid').unique().notNull(),
	apiLink: text('api_link').notNull()
});
