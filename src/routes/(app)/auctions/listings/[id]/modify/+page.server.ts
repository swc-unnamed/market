import { creditToInteger, integerToCredit } from '$lib/helpers/currency-conversion.js';
import { addItemAuctionListingSchema } from '$lib/models/zod/auctions/listings/add-item-auction-listing.schema.js';
import { modifyAuctionListingSchema } from '$lib/models/zod/auctions/listings/modify-auction-listing.schema.js';
import { db } from '$lib/server/db/index.js';
import { assets, auctionListingItems, auctionListings, entities } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals, depends }) => {
	const { id } = params;

	depends('auction_listing_modify');

	const listingRecord = await db.query.auctionListings.findFirst({
		where: (r, { eq }) => eq(r.id, id),
		with: {
			items: {
				with: {
					entity: true,
					asset: true
				}
			}
		}
	});

	if (!listingRecord) {
		return error(404, 'Listing not found');
	}

	if (listingRecord.listedById !== locals.user.id) {
		return error(403, 'You do not have permission to modify this listing');
	}

	const entityRecords = await db.query.entities.findMany({
		orderBy: asc(entities.name)
	});

	const itemForm = await superValidate(zod(addItemAuctionListingSchema));

	const listingForm = await superValidate(zod(modifyAuctionListingSchema));

	listingForm.data = {
		title: listingRecord.title,
		details: listingRecord.description,
		location: listingRecord.location,
		startingPrice: listingRecord.startingPrice
			? integerToCredit(listingRecord.startingPrice)
			: null,
		listerIsAnon: listingRecord.listerIsAnon,
		sendCreditsTo: listingRecord.sendCreditsTo
	};

	return {
		listingRecord: listingRecord,
		entityRecords: entityRecords,
		itemForm: itemForm,
		listingForm: listingForm
	};
};

export const actions = {
	save: async ({ request, params, locals }) => {
		const form = await superValidate(request, zod(modifyAuctionListingSchema));

		if (!form.valid) {
			return fail(400, { listingForm: form });
		}

		await db
			.update(auctionListings)
			.set({
				title: form.data.title,
				description: form.data.details,
				location: form.data.location,
				startingPrice: form.data.startingPrice ? creditToInteger(form.data.startingPrice) : null,
				listerIsAnon: form.data.listerIsAnon,
				sendCreditsTo: form.data.sendCreditsTo
			})
			.where(eq(auctionListings.id, params.id));
	},
	addItem: async ({ request, params }) => {
		const form = await superValidate(request, zod(addItemAuctionListingSchema));

		if (!form.valid) {
			return fail(400, { itemForm: form });
		}

		await db.transaction(async (tx) => {
			let assetId: string | null = null;

			if (form.data.combineId) {
				const asset = await tx
					.insert(assets)
					.values({
						entityId: form.data.entityId,
						combineId: Number(form.data.combineId),
						customImageUrl: form.data.customImageUrl,
						type: form.data.entityType
					})
					.returning({ id: assets.id });

				assetId = asset[0].id;
			}

			await tx
				.insert(auctionListingItems)
				.values({
					listingId: params.id,
					entityId: form.data.entityId,
					assetId: assetId,
					uuu: form.data.uuu,
					quantity: 1,
					customImageUrl: form.data.customImageUrl,
					customItem: form.data.customItem,
					customItemName: form.data.customItem ? form.data.customItemName : null,
					uniqueItem: form.data.uniqueItem
				})
				.returning({
					id: auctionListingItems.id
				});

			return {
				itemForm: form
			};
		});
	}
};
