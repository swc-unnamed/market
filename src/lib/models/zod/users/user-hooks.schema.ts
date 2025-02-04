import { WebhookEvent } from '$lib/consts/webhook-event';
import { z } from 'zod';

export const userHooksSchema = z.object({
	name: z.string(),
	type: z.enum(['discord']),
	webhook: z.string().url({ message: 'Must be a valid URL' }),
	events: z.array(
		z.enum(WebhookEvent).refine((v) => {
			return WebhookEvent.includes(v);
		})
	)
});
