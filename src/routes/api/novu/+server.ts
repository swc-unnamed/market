import { serve, Client } from '@novu/framework/sveltekit';
import { env } from '$env/dynamic/private';
import { newListingWorkflow } from '$lib/novu/auction-house';
import { activityFeed } from '$lib/novu/common/activity-feed';

const client = new Client({
  apiUrl: env.NOVU_API_URL || '',
  secretKey: env.NOVU_SECRET_KEY || 'nokey',
  strictAuthentication: false
});

export const { GET, POST, OPTIONS } = serve({
  workflows: [newListingWorkflow, activityFeed],
  client: client,
})