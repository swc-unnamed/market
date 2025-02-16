import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
import { creditToInteger } from '$lib/helpers/currency-conversion.js';
import { guard } from '$lib/helpers/guard.js';
import { prisma } from '$lib/prisma.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ params, locals, request }) => {
	guard(locals, AuctioneerPermissionPolicy, 'You do not have permission to record a sale.');
	const body = await request.json();

	const listingRecord = await prisma.auctionListing.findUnique({
		where: { id: params.id },
		include: {
			items: {
				include: {
					asset: true
				}
			}
		}
	});

	if (!listingRecord) {
		return new Response(JSON.stringify({ message: 'Listing not found' }), { status: 404 });
	}

	await prisma.auctionListing.recordSale({
		where: { id: listingRecord.id },
		data: {
			status: 'sold',
			winningBidderId: body.purchasedById,
			winningBid: creditToInteger(body.purchasedPrice)
		}
	});

	for (const item of listingRecord.items) {
		if (item.assetId) {
			await prisma.assetLedger.create({
				data: {
					action: 'auction_sold',
					assetId: item.assetId
				}
			});
		}
	}

	return json({
		success: true,
		message: 'Listing purchased has been processed.'
	});
};
