import { db } from '$lib/database/db'
import { GlobalAuctioneerAccessPolicy } from '$lib/utils/access-policies.js'
import { guard } from '$lib/utils/guard.js'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
		return redirect(303, '/auction-house')
	}

	const pendingListings = await db.auctionListing.findMany({
		where: {
			AND: [
				{ status: { in: ['Active'] } },
				{ liveAuctionId: null },
				{ type: 'Live' }
			]
		},
		include: {
			_count: {
				select: {
					items: true
				}
			}
		}
	});

	const availableModerators = await db.user.findMany({
		where: {
			AND: [
				{
					role: {
						in: ['Auctioneer', 'Developer', 'Tzar']
					}
				},
				{
					banned: false
				}
			]
		},
		include: {
			profile: {
				select: {
					id: true,
					displayName: true,
					avatar: true
				}
			}
		}
	})

	return {
		pendingListings: pendingListings,
		availableModerators: availableModerators
	}
}