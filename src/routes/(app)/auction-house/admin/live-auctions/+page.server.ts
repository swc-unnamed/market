import { AuctionLiveStatus, db } from '$lib/database/db.js'
import { GlobalAuctioneerAccessPolicy } from '$lib/utils/access-policies.js'
import { guard } from '$lib/utils/guard.js'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, url }) => {
  if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
    return redirect(303, '/auction-house')
  }

  const statusSearch = url.searchParams.get('status') || 'Upcoming';

  const auctions = await db.auctionLive.findMany({
    where: {
      ...(statusSearch === 'ALL' ? {} : { status: statusSearch as AuctionLiveStatus }),
    },
    orderBy: {
      startTime: 'asc'
    },
    include: {
      _count: {
        select: {
          listings: true
        }
      },
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
    }
  });

  return {
    auctions: auctions
  }
}