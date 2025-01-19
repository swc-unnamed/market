import { z } from 'zod';

export const entitySchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.string(),
	uid: z.string(),
	apiLink: z.string()
});

export type EntityType = z.infer<typeof entitySchema>;
