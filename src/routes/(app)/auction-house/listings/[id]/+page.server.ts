import { db } from '$lib/database/db.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
  const { id } = params;

  if (!id) {
    return error(404, {
      message: 'Listing not found'
    });
  }

  const record = await db.auctionListing.findUnique({
    where: { id: id },
    omit: {
      creatorId: true
    },
    include: {
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
      },
      liveAuction: {
        select: {
          id: true,
          title: true,
        }
      },
      subscriptions: {
        where: {
          userId: locals.user.id
        }
      }
    }
  });

  if (!record) {
    return error(404, {
      message: 'Listing not found'
    });
  }

  if (record.status === 'Draft') {
    return redirect(302, '/auction-house/listings');
  }

  return {
    listing: record
  }
}