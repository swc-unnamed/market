import { Roles } from '$lib/consts/roles';
import { z } from 'zod';

export const updateUserRoleSchema = z.object({
	id: z.string().min(1),
	role: z.enum(Roles)
});

export const banUserSchema = z.object({
	id: z.string().min(1),
	banned: z.boolean(),
	bannedReason: z.string().optional().nullable()
});
