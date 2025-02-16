import { Role } from '@prisma/client';
import { z } from 'zod';

export const updateUserRoleSchema = z.object({
	id: z.string().min(1),
	role: z.nativeEnum(Role)
});

export const banUserSchema = z.object({
	id: z.string().min(1),
	banned: z.boolean(),
	bannedReason: z.string().optional().nullable()
});
