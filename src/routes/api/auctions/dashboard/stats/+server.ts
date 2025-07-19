import { db } from '$lib/database/db.js'
import { GlobalPatronAccessPolicy } from '$lib/utils/access-policies'
import { formatNumberToShortString } from '$lib/utils/formatters.js'
import { guard } from '$lib/utils/guard.js'
import { json } from '@sveltejs/kit'
import { endOfMonth, startOfMonth } from 'date-fns'

export const GET = async ({ locals }) => {
  if (!guard(locals, GlobalPatronAccessPolicy)) {
    return json({ error: 'Unauthorized' }, { status: 403 })
  }
  const now = new Date()
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);

  const totalSoldValue = await getSoldStats(locals, currentMonthStart, currentMonthEnd);
  const totalWonValue = await getWonStats(locals, currentMonthStart, currentMonthEnd);


  const formattedTotalSoldValue = formatNumberToShortString(totalSoldValue);
  const formattedTotalWonValue = formatNumberToShortString(totalWonValue);

  return json({
    liveAuctionSold: formattedTotalSoldValue,
    liveAuctionWon: formattedTotalWonValue,
  })
}

async function getSoldStats(locals: App.Locals, start: Date, end: Date): Promise<number> {
  const currentMonthLiveAuctionSold = await db.auctionListing.findMany({
    where: {
      AND: [
        { creatorId: locals.user.id },
        { status: { in: ['Complete', 'Sold'] } },
        {
          liveAuction: {
            startTime: {
              gte: start,
              lte: end
            }
          }
        },
      ]
    },
  });

  let totalSoldValue: number = 0;

  for (const listing of currentMonthLiveAuctionSold) {
    if (listing.winningBidAmount && listing.winningBidAmount > 0) {
      totalSoldValue += listing.winningBidAmount;
    }
  }

  return totalSoldValue;
}

async function getWonStats(locals: App.Locals, start: Date, end: Date): Promise<number> {
  const currentMonthLiveAuctionWon = await db.auctionListing.findMany({
    where: {
      AND: [
        { winnerId: locals.user.id },
        { status: { in: ['Complete', 'Sold'] } },
        {
          liveAuction: {
            startTime: {
              gte: start,
              lte: end
            }
          }
        },
      ]
    },
  });

  let totalWonValue: number = 0;

  for (const listing of currentMonthLiveAuctionWon) {
    if (listing.winningBidAmount && listing.winningBidAmount > 0) {
      totalWonValue += listing.winningBidAmount;
    }
  }

  return totalWonValue;
}
