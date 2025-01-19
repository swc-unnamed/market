import { createId } from '../../../helpers/nanoid';
import { Roles } from '../../../consts/roles';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { CombineScopes } from '../../../consts/combine-scopes';

/**
 * Represents a user in the system.
 */
export const users = pgTable('users', {
	id: text('id')
		.unique()
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text('name').unique().notNull(),
	combineId: text('combine_id').unique().notNull(),
	discordId: text('discord_id').unique(),
	avatar: text('avatar'),
	joinDate: timestamp('join_date')
		.$defaultFn(() => new Date())
		.notNull(),
	scopes: text('scopes').array().notNull(),
	role: text('role', { enum: Roles }).default('patron').notNull(),
	banned: boolean('banned').default(false).notNull(),
	banned_reason: text('banned_reason')
});
