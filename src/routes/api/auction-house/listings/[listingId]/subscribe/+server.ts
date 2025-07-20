import { db } from '$lib/database/db'
import { activityFeed } from '$lib/novu/common/activity-feed.js';
import { novuClient } from "$lib/novu/server/client.server.js"
import { topicAuctionListing } from '$lib/novu/topics.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ locals, params }) => {
  const listing = await db.auctionListing.findUnique({
    where: {
      id: params.listingId
    }
  });

  if (!listing) {
    return json({
      message: 'Listing not found',
    }, { status: 404, statusText: 'Listing not found' });
  }

  const novu = novuClient();

  const topic = topicAuctionListing(params.listingId);

  await novu.topics.subscriptions.create({
    subscriberIds: [locals.user.id],
  }, topic);

  await activityFeed.trigger({
    to: locals.user.id,
    payload: {
      subject: 'Subscribed to Listing',
      body: `You have subscribed to updates for listing ${listing.listingNumber}.`,
      redirect: `/auction-house/listings/${params.listingId}`,
    }
  })

  return json({
    message: 'Subscribed to listing updates',
  })
}