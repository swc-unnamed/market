import { db } from '$lib/database/db.js'
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {

  const userListings = await db.auctionListing.findMany({
    where: {
      AND: [
        {
          status: {
            notIn: ['Expired', 'Cancelled', 'Complete', 'Sold']
          }
        },
        { creatorId: locals.user.id }
      ]
    },
    include: {
      items: {
        select: {
          id: true
        }
      }
    }
  });

  const drafts = userListings.filter(listing => listing.status === 'Draft');
  const active = userListings.filter(listing => listing.status === 'Active'
    || listing.status === 'PendingMakeover'
    || listing.status === 'PendingPayment'
    || listing.status === 'PendingVerification');


  const past = await db.auctionListing.findMany({
    where: {
      AND: [
        {
          status: {
            in: ['Complete', 'Sold']
          }
        },
        { creatorId: locals.user.id }
      ]
    },
    include: {
      items: {
        select: {
          id: true
        }
      }
    },
    take: 10,
  });

  return {
    drafts: drafts,
    active: active,
    past: past,
  }
}

export const actions = {
  createDraft: async ({ locals }) => {
    const currentDraftCount = await db.auctionListing.count({
      where: {
        AND: [
          { status: 'Draft' },
          { creatorId: locals.user.id }
        ]
      }
    });

    if (currentDraftCount >= 10) {
      return error(400, {
        message: 'You can only have up to 10 drafts at a time.'
      });
    }

    const newDraft = await db.auctionListing.create({
      data: {
        creatorId: locals.user.id,
        status: 'Draft',
        title: 'New Draft',
        description: '',
        location: '',
        minimumBid: 100_000,
        creditsRecipient: locals.user.profile.displayName,
        type: 'Live',
      }
    });

    return {
      success: true,
      draftId: newDraft.id
    }
  }
}