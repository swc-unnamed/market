import { query } from "$app/server";
import { db } from "$lib/database/db";

export const getTableData = query(async () => {
  const items = await db.auctionListingItem.findMany({
    where: {
      listing: {
        status: 'Active'
      },
    },
    include: {
      listing: {
        select: {
          id: true,
          listingNumber: true,
          title: true,
          location: true,
          type: true,
          creditsRecipient: true,
          minimumBid: true,
        }
      },
      entity: {
        select: {
          id: true,
          name: true,
          imageSmall: true
        }
      }
    }
  });

  return {
    items: items
  }
})