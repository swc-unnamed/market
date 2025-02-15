import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
import { guard } from '$lib/helpers/guard.js';
import { modifyAuctionSchema } from '$lib/models/zod/auctions/modify-auction.schema';
import { db } from '$lib/server/db';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { auctions } from '$lib/server/db/schema/auctions.js';
import { verifyRole } from '$lib/server/utils/verify-role.js';
import { error, redirect } from '@sveltejs/kit';
import { format } from 'date-fns/format';
import { eq } from 'drizzle-orm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals, params, depends }) => {
	guard(locals, AuctioneerPermissionPolicy);
	depends('auction_details');

	const record = await db.query.auctions.findFirst({
		where: (r, { eq }) => eq(r.id, params.id),
		with: {
			listings: {
				with: {
					items: {
						with: {
							asset: true,
							entity: true
						}
					},
					listedBy: {
						columns: {
							id: true,
							avatar: true,
							name: true
						}
					}
				}
			}
		}
	});

	if (!record) {
		throw error(404, {
			message: 'Auction was not found in the holochain.'
		});
	}

	const listingRecords = db.query.auctionListings.findMany({
		where: (r, { eq, and }) => and(eq(r.status, 'new'), eq(r.isDeleted, false))
	});

	const form = await superValidate(zod(modifyAuctionSchema));
	const formattedStartAt = format(record.startAt, "yyyy-MM-dd'T'HH:mm");

	form.data = {
		id: record.id,
		title: record.title,
		startAt: formattedStartAt,
		listings: record.listings.map((l) => l.id)
	};

	return {
		record: record,
		listingRecords: listingRecords,
		form: form
	};
};

export const actions = {
	save: async ({ params, locals, request }) => {
		guard(locals, AuctioneerPermissionPolicy);

		const record = await db.query.auctions.findFirst({
			where: (r, { eq }) => eq(r.id, params.id),
			with: {
				listings: true
			}
		});

		if (!record) {
			return fail(404, { message: 'Auction was not found in the holochain.' });
		}

		if (record.completedAt) {
			return fail(400, { message: 'Auction has already been completed.' });
		}

		const form = await superValidate(request, zod(modifyAuctionSchema));

		if (!form.valid) {
			return fail(400, {
				form: form,
				message: 'Data validation failed, holochain rejected submission.'
			});
		}

		await db
			.update(auctions)
			.set({
				title: form.data.title,
				startAt: new Date(form.data.startAt)
			})
			.where(eq(auctions.id, record.id));

		const selectedListings = form.data.listings;
		const listingsToDeselect = record.listings.filter((l) => !selectedListings.includes(l.id));

		await db.transaction(async (tx) => {
			for (const listing of listingsToDeselect) {
				await tx
					.update(auctionListings)
					.set({
						status: 'new',
						auctionId: null
					})
					.where(eq(auctionListings.id, listing.id));
			}

			for (const listingId of selectedListings) {
				if (record.listings.find((l) => l.id === listingId)) {
					continue;
				}
				await tx
					.update(auctionListings)
					.set({
						status: 'selected',
						auctionId: record.id
					})
					.where(eq(auctionListings.id, listingId));
			}
		});
	},

	delete: async ({ params, locals }) => {
		guard(locals, AuctioneerPermissionPolicy);

		const record = await db.query.auctions.findFirst({
			where: (r, { eq }) => eq(r.id, params.id),
			with: {
				listings: true
			}
		});

		if (!record) {
			return fail(404, { message: 'Auction was not found in the holochain.' });
		}

		if (record.completedAt) {
			return fail(400, { message: 'Auction has already been completed.' });
		}

		for (const listing of record!.listings) {
			await db.transaction(async (tx) => {
				await tx
					.update(auctionListings)
					.set({
						status: 'new',
						auctionId: null
					})
					.where(eq(auctionListings.id, listing.id));
			});
		}

		await db.delete(auctions).where(eq(auctions.id, record.id));

		return redirect(303, '/auctions');
	},

	/**
	 * Mark a listing record as complete.
	 */
	markListingRecordComplete: async ({ params, locals, request }) => {
		guard(locals, AuctioneerPermissionPolicy);
		const formData = await request.formData();
		const auctionId = params.id;
		const listingId = formData.get('listingId') as string;

		if (!auctionId || !listingId) {
			return fail(400, { message: 'Missing required parameters.' });
		}

		try {
			await db
				.update(auctionListings)
				.set({
					status: 'completed'
				})
				.where(eq(auctionListings.id, listingId));
		} catch (e) {
			return fail(500, { message: 'Failed to update listing status.' });
		}
	}
};
