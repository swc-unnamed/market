import { z } from 'zod';

export const systemSettingsSchema = z.object({
	id: z.string().optional(),
	auctionWebhookUrl: z.string().optional()
});
