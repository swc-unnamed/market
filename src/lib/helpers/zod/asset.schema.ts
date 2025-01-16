import { z } from 'zod';

export const assetSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.string(),
	uid: z.string(),
	apiLink: z.string()
});

export type AssetType = z.infer<typeof assetSchema>;
