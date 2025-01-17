import { createId } from '../../../helpers/nanoid';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text('name').unique().notNull(),
	combineId: text('combine_id').unique().notNull(),
	avatar: text('avatar'),
	joinDate: timestamp('join_date').$defaultFn(() => new Date()),
	scopes: text('scopes'),
	role: text('role', { enum: ['user', 'moderator', 'admin', 'developer', 'owner'] })
		.default('user')
		.notNull()
});
