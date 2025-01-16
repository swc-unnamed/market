import {
	auctionListingItemSchema,
	auctionListingSchema
} from '$lib/helpers/zod/auction-listing.schema.js';
import { db } from '$lib/server/db/index.js';
import { assets } from '$lib/server/db/schema/assets.js';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { getTableColumns } from 'drizzle-orm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const formSchema = z.object({
	...auctionListingSchema.shape,
	items: z.array(z.object({ ...auctionListingItemSchema.shape }))
});

export const load = async ({ locals }) => {
	const currentAssets = await db.query.assets.findMany();

	const form = await superValidate(zod(formSchema));

	form.data.items = [
		{
			assetId: null,
			u3: true,
			quantity: 1,
			customImageUrl: null
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
		const form = await superValidate(request, zod(formSchema));

		console.log(JSON.stringify(form.data, null, 2));

		if (!form.valid) {
			return fail(400, { form });
		}

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

		const items = form.data.items.map((item) => {
			return {
				listingId: listing[0].id,
				assetId: item.assetId,
				u3: item.u3,
				quantity: item.quantity,
				customImageUrl: item.customImageUrl
			};
		});

		return message(
			form,
			`Listing #${listing[0].listingNumber} has been submitted to the holochain for processing.`
		);
	}
};
