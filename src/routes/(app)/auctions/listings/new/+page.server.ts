import { prisma } from '$lib/prisma.js';
import { redirect } from '@sveltejs/kit';

import { SwcTimestamp } from 'swcombine.js';

export const load = async ({ locals }) => {
	const dl = await prisma.auctionListing.create({
		data: {
			title: `Draft Listing - ${SwcTimestamp.now().toString()}`,
			listedById: locals.user.id,
			sendCreditsTo: locals.user.name,
			location: '',
			startingBid: 100_000
		}
	});

	return redirect(307, `/auctions/listings/${dl.id}/modify`);
};
