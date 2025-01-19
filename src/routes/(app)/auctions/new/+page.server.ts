import { newAuctionListingSchema } from '$lib/models/zod/auction-listing.schema.js';
import { db } from '$lib/server/db/index.js';
import {
	assetLedger,
	assets,
	auctionListingHistory,
	auctionListingItems,
	auctionListings
} from '$lib/server/db/schema';
import { getTableColumns } from 'drizzle-orm';

import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
	const entityRecords = await db.query.entities.findMany();

	const form = await superValidate(zod(newAuctionListingSchema));

	form.data.items = [
		{
			entityId: '',
			uuu: true,
			quantity: 1,
			customImageUrl: '',
			asset: {
				type: '',
				combineId: null
			}
		}
	];

	return {
		user: locals.user,
		entities: entityRecords,
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
			await db.transaction(async (tx) => {
				const listing = await tx
					.insert(auctionListings)
					.values({
						title: form.data.title,
						description: form.data.description,
						location: form.data.location,
						listedById: locals.user.id,
						startingPrice: form.data.startingPrice,
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

					if (!item.asset.combineId) {
						setError(form, `items[${index}].asset.combineId`, 'A Combine ID is required');
						return fail(400, { form, message: 'Please correct the errors in the form.' });
					}

					if (!item.asset.typeId) {
						setError(form, `items[${index}].asset.typeId`, 'A Type is required');
						return fail(400, { form, message: 'Please correct the errors in the form.' });
					}

					// Create a new asset record if it doesn't already exist. If it conflicts, we aren't
					// going to do any. This will keep people from creating fake listings and overwriting
					// existing assets. Once the listing has been marked as sold, we will update the asset
					// with the custom image url and other info.
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
						action: 'listed'
					});

					await tx.insert(auctionListingItems).values({
						listingId: listing[0].id,
						assetId: asset[0].id,
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

				return message(
					form,
					`Listing #${listing[0].listingNumber} has been submitted to the holochain for processing.`
				);
			});
		} catch (err) {
			console.error(err);

			return fail(500, { form, message: 'An error occured on the holochain, try again later.' });
		}
	}
};
