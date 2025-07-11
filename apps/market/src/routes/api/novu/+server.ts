import { serve, Client } from '@novu/framework/sveltekit';
import { env } from '$env/dynamic/private';
import { newListingWorkflow } from '$lib/novu/auction-house';

const client = new Client({
  apiUrl: env.NOVU_API_URL,
  secretKey: env.NOVU_SECRET_KEY,
  strictAuthentication: false
});

export const { GET, POST, OPTIONS } = serve({
  workflows: [newListingWorkflow],
  client: client,
})