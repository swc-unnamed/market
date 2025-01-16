import { createId } from '../../../helpers/nanoid';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text('name').unique().notNull(),
	combineId: text('combine_id').unique().notNull(),
	avatar: text('avatar'),
	joinDate: integer('join_date', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	scopes: text('scopes'),
	role: text('role', { enum: ['user', 'moderator', 'admin'] }).default('user')
});
