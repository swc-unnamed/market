import { db } from '$lib/database/db'

export const load = async () => {
  const listings = await db.auctionListing.findMany({
    where: {
      AND: [
        { status: 'Active' },
        { type: { not: 'Private' } }
      ]
    },
    select: {
      id: true,
      listingNumber: true,
      type: true,
      title: true,
      location: true,
      creditsRecipient: true,
      minimumBid: true,
      items: {
        include: {
          entity: {
            select: {
              id: true,
              name: true,
              type: true,
              imageSmall: true,
              imageLarge: true
            }
          }
        }
      }
    }
  });

  return {
    listings: listings
  }
}