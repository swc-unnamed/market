import { auctionListingItemSchema } from '$lib/helpers/zod/auction-listing-item.schema';
import {
	auctionListingSchema,
	newAuctionListingSchema
} from '$lib/helpers/zod/auction-listing.schema.js';
import { db } from '$lib/server/db/index.js';
import { assets } from '$lib/server/db/schema/assets.js';
import { auctionListingHistory } from '$lib/server/db/schema/auction-listing-history.js';
import { auctionListingItems } from '$lib/server/db/schema/auction-listing-items.js';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { getTableColumns } from 'drizzle-orm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

export const load = async ({ locals }) => {
	const currentAssets = await db.query.assets.findMany();

	const form = await superValidate(zod(newAuctionListingSchema));

	form.data.items = [
		{
			assetId: '',
			u3: true,
			quantity: 1,
			customImageUrl: ''
		}
	];

	return {
		user: locals.user,
		assets: currentAssets,
		form: form
	};
};

export const actions = {
	createListing: async ({ request, locals }) => {
		const form = await superValidate(request, zod(newAuctionListingSchema));

		console.log(JSON.stringify(form.data, null, 2));

		if (!form.valid) {
			return fail(400, { form, message: 'Please correct the errors in the form.' });
		}

		try {
			const listing = await db
				.insert(auctionListings)
				.values({
					title: form.data.title,
					description: form.data.description,
					location: form.data.location,
					listedBy: locals.user.id,
					startingPrice: form.data.startingPrice,
					sendCreditsTo: form.data.sendCreditsTo,
					listerIsAnon: form.data.listerIsAnon
				})
				.returning({ id: auctionListings.id, listingNumber: auctionListings.listingNumber });

			if (!listing[0].id) {
				return fail(500, { form, message: 'An error occured on the holochain, try again later.' });
			}

			const items = form.data.items.map((item) => {
				return {
					listingId: listing[0].id,
					assetId: item.assetId,
					u3: item.u3,
					quantity: item.quantity,
					customImageUrl: item.customImageUrl
				};
			});

			await db.insert(auctionListingItems).values(items);

			await db.insert(auctionListingHistory).values({
				listingId: listing[0].id,
				event: 'created',
				message: `Listing #${listing[0].listingNumber} submitted to the holochain by ${form.data.listerIsAnon ? 'Anonymous' : locals.user.name}.`
			});

			return message(
				form,
				`Listing #${listing[0].listingNumber} has been submitted to the holochain for processing.`
			);
		} catch (err) {
			console.error(err);

			return fail(500, { form, message: 'An error occured on the holochain, try again later.' });
		}
	}
};
