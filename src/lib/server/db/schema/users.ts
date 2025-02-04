import { createId } from '@paralleldrive/cuid2';
import { Roles } from '../../../consts/roles';
import { bigint, boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { CombineScopes } from '../../../consts/combine-scopes';
import { relations } from 'drizzle-orm';
import { userWebhooks } from './user-webhooks';

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
	bannedReason: text('banned_reason'),
	refreshToken: text('refreshToken'),
	refreshTokenExpires: bigint('refresh_token_expires', { mode: 'number' })
});

export const userRelations = relations(users, ({ many }) => ({
	webhooks: many(userWebhooks)
}));
