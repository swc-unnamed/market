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

	// const entityRecords = await db.query.entities.findMany({
	// 	orderBy: asc(entities.name)
	// });

	// const form = await superValidate(zod(newAuctionListingSchema));

	// form.data.items = [
	// 	{
	// 		entityId: '',
	// 		entityName: '',
	// 		uuu: true,
	// 		quantity: 1,
	// 		customImageUrl: '',
	// 		asset: {
	// 			type: '',
	// 			combineId: null
	// 		}
	// 	}
	// ];

	// return {
	// 	user: locals.user,
	// 	entities: entityRecords,
	// 	form: form
	// };
};

export const actions = {
	createListing: async ({ request, locals }) => {
		const form = await superValidate(request, zod(newAuctionListingSchema));

		console.log(JSON.stringify(form.data, null, 2));

		if (!form.valid) {
			return fail(400, { form, message: 'Please correct the errors in the form.' });
		}

		// Validate form data
		for (const item of form.data.items) {
			const index = form.data.items.findIndex((i) => i === item);

			if (!item.asset.typeId) {
				setError(form, `items[${index}].asset.typeId`, 'A Type is required');
				return fail(400, { form, message: 'Please correct the errors in the form.' });
			}
		}

		try {
			await db.transaction(async (tx) => {
				const listing = await tx
					.insert(auctionListings)
					.values({
						title: form.data.title,
						description: form.data.description,
						location: form.data.location,
						listedById: locals.user.id,
						startingPrice: creditToInteger(form.data.startingPrice),
						sendCreditsTo: form.data.sendCreditsTo,
						listerIsAnon: form.data.listerIsAnon
					})
					.returning({ ...getTableColumns(auctionListings) });

				if (!listing[0].id) {
					return fail(500, {
						form,
						message: 'An error occured on the holochain, try again later.'
					});
				}

				for (const item of form.data.items) {
					const index = form.data.items.findIndex((i) => i === item);

					// Run this again - this is mostly for typescript. If it passed above it'll pass here.

					if (!item.asset.typeId) {
						setError(form, `items[${index}].asset.typeId`, 'A Type is required');
						return fail(400, { form, message: 'Please correct the errors in the form.' });
					}

					let assetId: string | null = null;

					// If the asset has a combineId, add that to the listing.
					if (item.asset.combineId) {
						const asset = await tx
							.insert(assets)
							.values({
								combineId: item.asset.combineId,
								typeId: parseInt(item.asset.typeId),
								type: item.asset.type,
								entityId: item.entityId
							})
							.onConflictDoNothing()
							.returning({ ...getTableColumns(assets) });

						// Create a new asset chain record
						await tx.insert(assetLedger).values({
							assetId: asset[0].id,
							action: 'listed_auction',
							value: creditToInteger(form.data.startingPrice)
						});

						assetId = asset[0].id;
					}

					await tx.insert(auctionListingItems).values({
						listingId: listing[0].id,
						assetId: assetId,
						entityId: item.entityId,
						customImageUrl: item.customImageUrl,
						uuu: item.uuu,
						quantity: item.quantity
					});
				}

				await tx.insert(auctionListingHistory).values({
					listingId: listing[0].id,
					event: 'created',
					message: `Listing #${listing[0].listingNumber} submitted to the holochain by ${form.data.listerIsAnon ? 'Anonymous' : locals.user.name}.`
				});
			});

			return message(form, `Listing has been submitted to the holochain for processing.`);
		} catch (err) {
			console.error(err);

			return fail(500, { form, message: 'An error occured on the holochain, try again later.' });
		}
	}
};
