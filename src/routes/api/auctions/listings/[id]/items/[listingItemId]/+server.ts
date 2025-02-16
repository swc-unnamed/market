import { MagistratePermissionPolicy } from '$lib/consts/permission-policies.js';
import { guard } from '$lib/helpers/guard.js';
import { prisma } from '$lib/prisma.js';
import { error, json } from '@sveltejs/kit';

export const DELETE = async ({ locals, params }) => {
	const { id, listingItemId } = params;

	const alRecord = await prisma.auctionListing.findUnique({
		where: { id: id },
		include: {
			items: true
		}
	});

	if (!alRecord) {
		return error(404, 'Listing not found');
	}

	if (alRecord.listedById !== locals.user.id) {
		guard(
			locals,
			MagistratePermissionPolicy,
			"You don't have permission to delete this listing item."
		);
	}

	const listingItemRecord = alRecord.items.find((item) => item.id === listingItemId);

	if (!listingItemRecord) {
		return error(404, 'Listing item not found on this listing.');
	}

	await prisma.auctionListingItem.delete({
		where: {
			id: listingItemId,
			auctionListingId: alRecord.id
		}
	});

	return json({
		status: 200,
		message: 'Listing item deleted successfully'
	});
};
