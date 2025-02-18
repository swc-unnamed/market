import { z } from 'zod';

/**
 * Update user scopes schema.
 */
export const updateUserScopesSchema = z.object({
	id: z.string(),
	scopes: z.array(z.string())
});
