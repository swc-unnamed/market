import { db } from '$lib/database/db.js'
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const auction = await db.auctionLive.findUnique({
    where: {
      id: params.id
    },
    include: {
      listings: {
        omit: {
          creatorId: true
        },
        include: {
          items: {
            include: {
              entity: true
            }
          }
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