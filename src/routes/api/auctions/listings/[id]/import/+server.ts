import { prisma } from '$lib/prisma.js';
import { error, json } from '@sveltejs/kit';

export const POST = async ({ locals, request, params }) => {
	const listing = await prisma.auctionListing.findUnique({
		where: { id: params.id }
	});

	if (!listing) {
		throw error(404, 'Listing not found');
	}

	if (listing.status !== 'draft' && listing.status !== 'new') {
		throw error(400, 'Listing is not in a draft or new state');
	}

	if (listing.listedById !== locals.user.id) {
		throw error(403, 'User does not own this listing');
	}

	const body: { uid: string; combineId: string }[] = await request.json();

	console.log(body);

	await prisma.auctionListing.update({
		where: { id: params.id },
		data: {}
	});

	return json({ success: true });
};
