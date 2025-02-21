import { IntegrationScope } from '@prisma/client';
import { z } from 'zod';

export const requestIntegrationSchema = z.object({
	name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
	description: z.string().min(3, { message: 'Description must be at least 3 characters long' }),
	scopes: z.array(z.enum(['user_read', 'user_create']))
});
