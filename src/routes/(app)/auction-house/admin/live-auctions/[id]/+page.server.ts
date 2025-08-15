import { db } from '$lib/database/db'
import { GlobalAuctioneerAccessPolicy } from '$lib/utils/access-policies.js'
import { guard } from '$lib/utils/guard.js'
import { error, fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { liveAuctionSchema } from '$lib/models/schemas/live-auction.schema.js'

export const load = async ({ locals, params, depends }) => {
  if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
    return redirect(303, '/auction-house')
  }

  depends('app:auction-house/admin/live-auctions')

  const auction = await db.auctionLive.findUnique({
    where: {
      id: params.id
    },
    include: {
      moderator: {
        select: {
          id: true,
          profile: {
            select: {
              id: true,
              displayName: true,
              avatar: true
            }
          }
        }
      },
      listings: {
        include: {
          items: true
        },
        orderBy: {
          listingNumber: 'asc'
        }
      }
    }
  });

  if (!auction) {
    return error(404, {
      message: 'Auction was not found.'
    })
  }

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

  return {
    auction: auction,
    availableModerators: availableModerators
  }
}

export const actions = {
  save: async ({ request, locals, params }) => {
    if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
      return redirect(303, '/auction-house')
    }

    const form = await superValidate(request, zod(liveAuctionSchema));

    if (!form.valid) {
      return { form };
    }

    const { title, description, startTime, moderatorId } = form.data;

    const auction = await db.auctionLive.findUnique({
      where: {
        id: params.id
      }
    });

    if (!auction) {
      return error(404, {
        message: 'Auction was not found.'
      });
    }

    await db.auctionLive.update({
      where: {
        id: params.id
      },
      data: {
        title: title,
        description: description,
        startTime: new Date(startTime),
        moderatorId: moderatorId,
      }
    });

    return { updateAuctionForm: { ...form, success: true } };
  },

  end: async ({ locals, params }) => {
    if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
      return redirect(303, '/auction-house')
    }

    const auction = await db.auctionLive.findUnique({
      where: {
        id: params.id
      }
    });

    if (!auction) {
      return error(404, {
        message: 'Auction was not found.'
      });
    }

    await db.auctionLive.update({
      where: {
        id: params.id
      },
      data: {
        endedAt: new Date(),
        status: 'Completed'
      }
    });

    return redirect(303, `/auction-house/admin/live-auctions/${params.id}`);
  },

  close: async ({ locals, params }) => {
    if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
      return fail(403, { message: 'You do not have permission to close this auction.' });
    }

    const auction = await db.auctionLive.findUnique({
      where: { id: params.id },
      include: {
        listings: true
      }
    });

    if (!auction) {
      return error(404, { message: 'Auction not found.' });
    }

    if (auction.status !== 'Completed') {
      return fail(400, { message: 'Auction must be completed before it can be closed.' });
    }

    let canClose = true;

    for (const listing of auction.listings) {
      if (listing.status !== 'Complete') {
        canClose = false;
      }
    }

    if (!canClose) {
      return fail(400, {
        message: 'All listings must be complete before the auction can be closed.'
      })
    }

    await db.auctionLive.update({
      where: { id: params.id },
      data: {
        status: 'Closed'
      }
    })

    return {
      message: 'Auction has been closed'
    }
  }
}