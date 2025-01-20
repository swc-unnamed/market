import { createId } from '@paralleldrive/cuid2';
import { pgTable, text } from 'drizzle-orm/pg-core';

/**
 * Represents an entity in the game. This could be an item, ship, facility, materials etc.
 */
export const entities = pgTable('entities', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text('name').notNull(),
	type: text('type').notNull(),
	uid: text('uid').unique().notNull(),
	apiLink: text('api_link').notNull()
});
