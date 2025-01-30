import { creditToInteger } from '$lib/helpers/currency-conversion.js';
import { newAuctionListingSchema } from '$lib/models/zod/auctions';
import { db } from '$lib/server/db/index.js';
import {
	assetLedger,
	assets,
	auctionListingHistory,
	auctionListingItems,
	auctionListings,
	entities
} from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { format } from 'date-fns';
import { asc, getTableColumns } from 'drizzle-orm';

import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
	const draftDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
	const draftListing = await db
		.insert(auctionListings)
		.values({
			title: `Draft Listing`,
			listedById: locals.user.id,
			sendCreditsTo: locals.user.name
		})
		.returning({ id: auctionListings.id });

	if (!draftListing[0].id) {
		return fail(500, { message: 'An error occured on the holochain, try again later.' });
	}

	return redirect(307, `/auctions/listings/${draftListing[0].id}/modify`);
};
