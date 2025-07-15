import { db } from '$lib/database/db'

export const load = async () => {
  const auctions = await db.auctionLive.findMany({
    where: {
      status: {
        in: ['Upcoming', 'InProgress', 'Completed']
      }
    },
    include: {
      moderator: {
        select: {
          profile: {
            select: {
              id: true,
              displayName: true,
              avatar: true
            }
          }
        }
      }
    }
  });

  return {
    auctions: auctions
  }
}