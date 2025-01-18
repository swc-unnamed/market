import { createId } from '../../../helpers/nanoid';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { Roles } from '../../../consts/roles';

export const users = pgTable('users', {
	id: text('id').unique().primaryKey().$defaultFn(() => createId()),
	name: text('name').unique().notNull(),
	combineId: text('combine_id').unique().notNull(),
	discordId: text('discord_id').unique(),
	avatar: text('avatar'),
	joinDate: timestamp('join_date').$defaultFn(() => new Date()),
	scopes: text('scopes'),
	role: text('role', { enum: Roles }).default('Patron').notNull(),
	banned: boolean('banned').default(false),
	banned_reason: text('banned_reason'),
});
