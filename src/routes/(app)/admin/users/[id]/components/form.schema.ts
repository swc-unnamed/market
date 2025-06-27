import { z } from 'zod';

export const adminUserUpdateSchema = z
	.object({
		id: z.string(),
		displayName: z.string().min(3).max(50),
		role: z.enum(['Patron', 'Auctioneer', 'Developer', 'Tzar']),
		banned: z.boolean(),
		bannedReason: z.string().nullable()
	})
	.refine((input) => {
		if (input.banned && !input.bannedReason) {
			return false;
		}
		return true;
	});

export type AdminUserUpdateSchema = z.infer<typeof adminUserUpdateSchema>;
