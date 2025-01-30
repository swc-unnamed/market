import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
import { creditToInteger } from '$lib/helpers/currency-conversion.js';
import { db } from '$lib/server/db/index.js';
import { assetLedger } from '$lib/server/db/schema/asset-ledger.js';
import { auctionListingHistory } from '$lib/server/db/schema/auction-listing-history.js';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { verifyRole } from '$lib/server/utils/verify-role.js';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const POST = async ({ params, locals, request }) => {
	verifyRole({
		userRole: locals.user.role,
		allowedRoles: AuctioneerPermissionPolicy
	});
	console.log(params.id);

	const body = await request.json();

	console.log(body);

	const listingRecord = await db.query.auctionListings.findFirst({
		where: (r, { eq }) => eq(r.id, params.id),
		with: {
			items: {
				with: {
					asset: true
				}
			}
		}
	});

	if (!listingRecord) {
		return new Response(JSON.stringify({ message: 'Listing not found' }), { status: 404 });
	}

	await db
		.update(auctionListings)
		.set({
			status: 'sold',
			purchasedById: body.purchasedById,
			purchasedPrice: creditToInteger(body.purchasedPrice)
		})
		.where(eq(auctionListings.id, listingRecord.id));

	await db.insert(auctionListingHistory).values({
		listingId: listingRecord.id,
		event: 'status_updated',
		message: 'Listing purchased and pending delivery.'
	});

	for (const item of listingRecord.items) {
		if (item.assetId) {
			await db.insert(assetLedger).values({
				action: 'sold_auction',
				assetId: item.assetId,
				ownerId: body.purchasedById
			});
		}
	}

	return json({
		success: true,
		message: 'Listing purchased has been processed.'
	});
};
