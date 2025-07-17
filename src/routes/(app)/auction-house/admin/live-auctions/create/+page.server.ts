import { db } from '$lib/database/db'
import { GlobalAuctioneerAccessPolicy } from '$lib/utils/access-policies.js'
import { guard } from '$lib/utils/guard.js'
import { redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { liveAuctionSchema } from '$lib/models/schemas/live-auction.schema'
import { activityFeed } from '$lib/novu/workflows/common/activity-feed'

export const load = async ({ locals }) => {
  if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
    return redirect(303, '/auction-house')
  }

  const pendingListings = await db.auctionListing.findMany({
    where: {
      AND: [
        { status: { in: ['Active'] } },
        { liveAuctionId: null },
        { type: 'Live' }
      ]
    },
    include: {
      _count: {
        select: {
          items: true
        }
      }
    }
  });

  const availableModerators = await db.user.findMany({
    where: {
      AND: [
        {
          role: {
            in: ['Auctioneer', 'Developer', 'Tzar']
          }
        },
        {
          banned: false
        }
      ]
    },
    include: {
      profile: {
        select: {
          id: true,
          displayName: true,
          avatar: true
        }
      }
    }
  });

  const createAuctionForm = await superValidate(zod(liveAuctionSchema));

  return {
    pendingListings: pendingListings,
    availableModerators: availableModerators,
    createAuctionForm: createAuctionForm
  }
}

export const actions = {
  create: async ({ request, locals }) => {
    if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
      return redirect(303, '/auction-house')
    }

    const form = await superValidate(request, zod(liveAuctionSchema));

    if (!form.valid) {
      return { form };
    }

    const { title, description, startTime, moderatorId, listings } = form.data;

    console.log(new Date(startTime));

    const newAuction = await db.auctionLive.create({
      data: {
        title: title,
        description: description,
        startTime: new Date(startTime),
        moderatorId: moderatorId,
        listings: {
          connect: listings.map(id => ({ id }))
        }
      },
      include: {
        listings: true
      }
    });

    for (const listing of newAuction.listings) {
      await activityFeed.trigger({
        to: listing.creatorId,
        payload: {
          subject: 'Listing added to Auction',
          body: `Your listing, #${listing.listingNumber}, has been added to the ${newAuction.title} auction.`,
          redirect: `/auction-house/listings/${listing.id}`
        }
      })
    }

    return { form: { ...form, success: true }, newAuction };
  }
}