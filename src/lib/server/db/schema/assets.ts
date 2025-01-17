import { createId } from '../../../helpers/nanoid';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const assets = pgTable('assets', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text('name').notNull(),
	type: text('type').notNull(),
	uid: text('uid').unique().notNull(),
	apiLink: text('api_link').notNull()
});
