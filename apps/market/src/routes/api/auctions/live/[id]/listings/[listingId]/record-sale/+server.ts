import { guard } from '$lib/utils/guard';
import { GlobalAuctioneerAccessPolicy } from '$lib/utils/access-policies';
import { json } from '@sveltejs/kit';
import { AuctionListingStatus, db } from '$lib/database/db';

export const POST = async ({ locals, params, request }) => {
	if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
		return json({ error: 'Unauthorized' }, { status: 403 })
	}

	const { id } = params;

	if (!id) {
		return json({ error: 'Auction ID is required' }, { status: 400 })
	}

	const auction = await db.auctionLive.findUnique({
		where: {
			id: id
		}
	});

	if (!auction) {
		return json({ error: 'Auction not found' }, { status: 404 })
	}

	const listing = await db.auctionListing.findUnique({
		where: {
			id: params.listingId
		}
	});

	if (!listing) {
		return json({ error: 'Listing not found' }, { status: 404 })
	}

	const data = await request.json();
	if (!data || !data.winnerId || !data.saleAmount) {
		return json({ error: 'Invalid data' }, { status: 400 })
	}

	const { winnerId, saleAmount, status }: { winnerId: string, saleAmount: string, status: typeof AuctionListingStatus } = data;

	const sanitizedAmount = parseInt(saleAmount.replace(/[,\s]/g, ''), 10);

	if (isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
		return json({ error: 'Invalid sale amount' }, { status: 400 });
	}

	await db.auctionListing.update({
		where: {
			id: params.listingId
		},
		data: {
			status: status,
			winner: {
				connect: {
					id: winnerId
				}
			},
			winningBidAmount: sanitizedAmount
		}
	});

	// TODO: Send notifications

	return json({ success: true, message: 'Sale recorded successfully' });
}