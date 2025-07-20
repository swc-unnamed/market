import { db } from '$lib/database/db'
import { activityFeed } from '$lib/novu/common/activity-feed.js';
import { GlobalAdminAccessPolicy } from '$lib/utils/access-policies.js';
import { json } from '@sveltejs/kit';

export const DELETE = async ({ locals, params }) => {
  const listing = await db.auctionListing.findUnique({
    where: {
      id: params.listingId
    }
  });

  if (!listing) {
    return json({
      message: 'Listing not found',
    }, { status: 404, statusText: 'Listing not found' })
  }

  let canDelete = false;

  if (listing.creatorId === locals.user.id && listing.status === 'Draft') {
    canDelete = true;
  }

  if (GlobalAdminAccessPolicy.includes(locals.user.role)) {
    canDelete = true
  }

  if (canDelete) {
    await db.auctionListing.delete({
      where: {
        id: params.listingId
      },
      include: {
        items: {
          where: {
            listingId: params.listingId
          }
        }
      }
    });

    try {

      await activityFeed.trigger({
        to: listing.creatorId,
        payload: {
          subject: 'Listing Deleted',
          body: `Listing #${listing.listingNumber} was deleted by ${locals.user.profile.displayName}`,
          redirect: '/auction-house/dashboard'
        },
      });
    } catch (err) {
      console.log(err)
    }

    return json({
      message: 'Listing deleted successfully',
    }, { status: 200, statusText: 'Listing deleted successfully' });
  } else {
    return json({
      message: 'You do not have permission to delete this listing.',
    }, { status: 403, statusText: 'You do not have permission to delete this listing.' })
  }
}