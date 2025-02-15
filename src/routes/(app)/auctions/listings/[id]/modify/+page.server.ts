import { creditToInteger, integerToCredit } from '$lib/helpers/currency-conversion.js';
import { addItemAuctionListingSchema } from '$lib/models/zod/auctions/listings/add-item-auction-listing.schema.js';
import { modifyAuctionListingSchema } from '$lib/models/zod/auctions/listings/modify-auction-listing.schema.js';
import { prisma } from '$lib/prisma.js';
import { db } from '$lib/server/db/index.js';
import { error, json, redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals, depends }) => {
	const { id } = params;

	depends('auction_listing_modify');

	const listingRecord = await prisma.auctionListing.findUnique({
		where: { id: id },
		include: {
			items: {
				include: {
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

	if (listingRecord.status === 'sold' || listingRecord.status === 'completed') {
		throw redirect(303, `/auctions/listings/${id}`);
	}

	const entities = await prisma.entity.findMany({
		orderBy: {
			name: 'asc'
		}
	});

	const itemForm = await superValidate(zod(addItemAuctionListingSchema));

	const listingForm = await superValidate(zod(modifyAuctionListingSchema));

	listingForm.data = {
		title: listingRecord.title,
		details: listingRecord.description,
		location: listingRecord.location,
		startingBid: listingRecord.startingBid ? integerToCredit(listingRecord.startingBid) : undefined,
		anonymousListing: listingRecord.anonymousListing,
		sendCreditsTo: listingRecord.sendCreditsTo
	};

	return {
		listingRecord: listingRecord,
		entityRecords: entities,
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

		await prisma.auctionListing.update({
			where: { id: params.id },
			data: {
				title: form.data.title,
				description: form.data.details,
				location: form.data.location,
				startingBid: form.data.startingBid ? creditToInteger(form.data.startingBid) : undefined,
				anonymousListing: form.data.anonymousListing,
				sendCreditsTo: form.data.sendCreditsTo
			}
		});
	},
	addItem: async ({ request, params }) => {
		const form = await superValidate(request, zod(addItemAuctionListingSchema));

		if (!form.valid) {
			return fail(400, { itemForm: form });
		}

		await prisma.$transaction(async (tx) => {
			let assetId: string | null = null;

			if (form.data.combineId) {
				const asset = await tx.asset.create({
					data: {
						entityId: form.data.entityId,
						combineId: form.data.combineId,
						customImage: form.data.customImageUrl,
						type: form.data.entityType
					}
				});

				assetId = asset.id;
			}

			const item = await tx.auctionListingItem.create({
				data: {
					auctionListingId: params.id,
					entityId: form.data.entityId,
					assetId: assetId,
					uuu: form.data.uuu,
					quantity: form.data.quantity,
					isCustomItem: form.data.customItem,
					customImage: form.data.customImageUrl,
					uniqueItem: form.data.uniqueItem
				}
			});

			return {
				itemForm: form
			};
		});
	}
};
