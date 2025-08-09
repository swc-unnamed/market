import { command, getRequestEvent } from "$app/server";
import { db } from "$lib/database/db";
import { activityFeed } from "$lib/novu/common/activity-feed";
import { novuClient } from "$lib/novu/server/client.server";
import { topicAuctionListing } from "$lib/novu/topics";
import { error } from "@sveltejs/kit";
import z from "zod";

export const subscribeCommand = command(z.string(), async (id) => {
  const listing = await db.auctionListing.findUnique({
    where: {
      id: id
    },
  });

  if (!listing) {
    return error(404, { message: 'Listing was not found!' })
  }

  const { locals } = getRequestEvent();

  const novu = novuClient();

  const topic = topicAuctionListing(id);

  await db.auctionListingSubscription.upsert({
    where: {
      idx_user_listing: {
        userId: locals.user.id,
        listingId: id
      }
    },
    create: {
      userId: locals.user.id,
      listingId: id
    },
    update: {}
  });

  await novu.topics.subscriptions.create({
    subscriberIds: [locals.user.id],
  }, topic);

  await activityFeed.trigger({
    to: locals.user.id,
    payload: {
      subject: `Subscribed to Listing`,
      body: `You have subscribed to updates for listing ${listing.listingNumber}.`,
      redirect: `/auction-house/listings/${id}`,
    }
  });

  console.log(`Subscribed to listing ${id} updates for user ${locals.user.id}`);

  return { success: true }
});

export const unsubscribeCommand = command(z.string(), async (id) => {
  const listing = await db.auctionListing.findUnique({
    where: {
      id: id
    },
  });

  if (!listing) {
    return error(404, { message: 'Listing was not found!' })
  }

  const { locals } = getRequestEvent();

  const novu = novuClient();

  const topic = topicAuctionListing(id);

  const sub = await db.auctionListingSubscription.findUnique({
    where: {
      idx_user_listing: {
        userId: locals.user.id,
        listingId: id
      }
    }
  });

  if (sub) {
    await db.auctionListingSubscription.delete({
      where: {
        id: sub.id
      }
    })
  } else {
    console.log(`No subscription found for user ${locals.user.id} on listing ${id}`);
  }

  await novu.topics.subscriptions.delete({
    subscriberIds: [locals.user.id],
  }, topic);

  return { success: true }
});