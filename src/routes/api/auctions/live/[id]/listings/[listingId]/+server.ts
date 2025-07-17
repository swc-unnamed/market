import { db } from '$lib/database/db.js';
import { activityFeed } from '$lib/novu/workflows/common/activity-feed.js';
import { GlobalAuctioneerAccessPolicy, GlobalPatronAccessPolicy } from '$lib/utils/access-policies.js';
import { guard } from '$lib/utils/guard.js';
import { json } from '@sveltejs/kit';

export const PATCH = async ({ locals, params }) => {
  if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
    return json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = params;

  if (!id) {
    return json({ error: 'Auction ID is required' }, { status: 400 })
  }

  const auction = await db.auctionLive.findUnique({
    where: {
      id: id
    }
  });

  if (!auction) {
    return json({ error: 'Auction not found' }, { status: 404 })
  }

  const listing = await db.auctionListing.findUnique({
    where: {
      id: params.listingId
    }
  });

  if (!listing) {
    return json({ error: 'Listing not found' }, { status: 404 })
  }

  await db.auctionListing.update({
    where: {
      id: params.id
    },
    data: {
      liveAuctionId: id,
    }
  });

  await activityFeed.trigger({
    to: listing.creatorId,
    payload: {
      subject: 'Listing added to Auction',
      body: `Your listing, #${listing.listingNumber}, has been added to the ${auction.title} auction.`,
      redirect: `/auction-house/listings/${listing.id}`
    }
  })

  return json({
    message: 'Listing added to auction successfully'
  })
}

export const DELETE = async ({ locals, params }) => {
  if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
    return json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = params;

  if (!id) {
    return json({ error: 'Auction ID is required' }, { status: 400 })
  }

  const auction = await db.auctionLive.findUnique({
    where: {
      id: id
    }
  });

  if (!auction) {
    return json({ error: 'Auction not found' }, { status: 404 })
  }

  const listing = await db.auctionListing.findUnique({
    where: {
      id: params.listingId
    }
  });

  if (!listing) {
    return json({ error: 'Listing not found' }, { status: 404 })
  }

  await db.auctionListing.update({
    where: {
      id: params.listingId
    },
    data: {
      liveAuctionId: null,
    }
  });

  return json({
    message: 'Listing removed from auction successfully'
  })
}

export const GET = async ({ locals, params }) => {
  if (!guard(locals, GlobalPatronAccessPolicy)) {
    return json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id, listingId } = params;

  if (!id || !listingId) {
    return json({ error: 'Auction ID and Listing ID are required' }, { status: 400 })
  }

  const listing = await db.auctionListing.findFirst({
    where: {
      AND: [
        { id: listingId },
        { liveAuctionId: id }
      ]
    },
    omit: {
      creatorId: true
    },
    include: {
      items: {
        include: {
          entity: {
            omit: {
              combineData: true,
              combineHref: true,
              combineUid: true
            }
          }
        }
      }
    }
  });

  const users = await db.user.findMany({
    where: {
      banned: false
    },
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          id: true,
          displayName: true,
          avatar: true
        }
      }
    }
  });

  return json({
    ...listing,
    users: users
  })
}