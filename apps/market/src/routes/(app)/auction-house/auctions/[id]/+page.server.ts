import { db } from '$lib/database/db.js'
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const auction = await db.auctionLive.findUnique({
    where: {
      id: params.id
    },
    include: {
      listings: {
        include: {
          items: true
        }
      }
    }
  });

  if (!auction) {
    return error(404, 'Auction not found');
  }

  return {
    auction: auction
  }
}