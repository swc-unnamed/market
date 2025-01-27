import { addItemAuctionListingSchema } from '$lib/models/zod/auctions/listings/add-item-auction-listing.schema.js';
import { db } from '$lib/server/db/index.js';
import { entities } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import { asc } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals }) => {
	const { id } = params;

	const listingRecord = await db.query.auctionListings.findFirst({
		where: (r, { eq }) => eq(r.id, id)
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

	return {
		listingRecord: listingRecord,
		entityRecords: entityRecords,
		itemForm: itemForm
	};
};

export const actions = {
	addItem: async ({ locals }) => {
		return json({ success: true });
	}
};
