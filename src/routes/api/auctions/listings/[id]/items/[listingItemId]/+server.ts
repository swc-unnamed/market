import { MagistratePermissionPolicy } from '$lib/consts/permission-policies.js';
import { db } from '$lib/server/db/index.js';
import { assetLedger } from '$lib/server/db/schema/asset-ledger.js';
import { auctionListingItems } from '$lib/server/db/schema/auction-listing-items.js';
import { verifyRole } from '$lib/server/utils/verify-role.js';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const DELETE = async ({ locals, params }) => {
	const { id, listingItemId } = params;

	const auctionListingRecord = await db.query.auctionListings.findFirst({
		where: (r, { eq }) => eq(r.id, id),
		with: {
			items: true
		}
	});

	if (!auctionListingRecord) {
		return error(404, 'Listing not found');
	}

	if (auctionListingRecord.listedById !== locals.user.id) {
		const roleAllowsAction = verifyRole({
			userRole: locals.user.role,
			allowedRoles: MagistratePermissionPolicy,
			noRedirect: true
		});

		if (!roleAllowsAction) {
			return error(403, 'You do not have permission to modify this listing');
		}
	}

	const listingItemRecord = auctionListingRecord.items.find((item) => item.id === listingItemId);

	if (!listingItemRecord) {
		return error(404, 'Listing item not found on this listing.');
	}

	await db.delete(auctionListingItems).where(eq(auctionListingItems.id, listingItemId));

	if (listingItemRecord.assetId) {
		await db.insert(assetLedger).values({
			action: 'delisted',
			assetId: listingItemRecord.assetId
		});
	}

	return json({
		status: 200,
		message: 'Listing item deleted successfully'
	});
};
