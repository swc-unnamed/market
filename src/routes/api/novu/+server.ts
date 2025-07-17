import { serve, Client } from '@novu/framework/sveltekit';
import { env } from '$env/dynamic/private';
import { newListingWorkflow } from '$lib/novu/workflows/auction-house';
import { activityFeed } from '$lib/novu/workflows/common/activity-feed';
import { welcome } from '$lib/novu/workflows/common/welcome';

const client = new Client({
  apiUrl: env.NOVU_API_URL,
  secretKey: env.NOVU_SECRET_KEY,
  strictAuthentication: false
});

export const { GET, POST, OPTIONS } = serve({
  workflows: [newListingWorkflow, activityFeed, welcome],
  client: client,
})