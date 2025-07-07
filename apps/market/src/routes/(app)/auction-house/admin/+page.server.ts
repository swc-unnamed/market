import { db } from '$lib/database/db'
import { GlobalAuctioneerAccessPolicy } from '$lib/utils/access-policies.js'
import { guard } from '$lib/utils/guard.js'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
		return redirect(303, '/auction-house')
	}

	const auctions = await db.auctionLive.findMany({
		orderBy: {
			startTime: 'desc'
		},
	});

	const pendingListings = await db.auctionListing.findMany({
		where: {
			AND: [
				{ status: { in: ['Active'] } },
				{ liveAuctionId: null },
				{ type: 'Live' }
			]
		}
	});

	return {
		auctions: auctions,
		pendingListings: pendingListings
	}
}