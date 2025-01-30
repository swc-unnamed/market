import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
import { modifyAuctionSchema } from '$lib/models/zod/auctions/modify-auction.schema';
import { db } from '$lib/server/db';
import { auctionListingHistory } from '$lib/server/db/schema/auction-listing-history.js';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { auctions } from '$lib/server/db/schema/auctions.js';
import { verifyRole } from '$lib/server/utils/verify-role.js';
import { error, redirect } from '@sveltejs/kit';
import { format } from 'date-fns/format';
import { eq } from 'drizzle-orm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals, params }) => {
	verifyRole({
		userRole: locals.user.role,
		allowedRoles: AuctioneerPermissionPolicy
	});

	const record = await db.query.auctions.findFirst({
		where: (r, { eq }) => eq(r.id, params.id),
		with: {
			listings: {
				columns: {
					id: true,
					title: true,
					startingPrice: true
				}
			}
		}
	});

	if (!record) {
		throw error(404, {
			message: 'Auction was not found in the holochain.'
		});
	}

	const listingRecords = await db.query.auctionListings.findMany({
		where: (r, { eq }) => eq(r.status, 'new')
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
		const canPerform = verifyRole({
			userRole: locals.user.role,
			allowedRoles: AuctioneerPermissionPolicy
		});

		if (!canPerform) {
			return fail(403, { message: 'Unauthorized' });
		}

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

				await tx.insert(auctionListingHistory).values({
					event: 'status_updated',
					listingId: listing.id,
					message: 'Listing deselected from auction.'
				});
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

				await tx.insert(auctionListingHistory).values({
					event: 'status_updated',
					listingId: listingId,
					message: 'Listing selected for auction.'
				});
			}
		});
	},

	delete: async ({ params, locals }) => {
		const canPerform = verifyRole({
			userRole: locals.user.role,
			allowedRoles: AuctioneerPermissionPolicy
		});

		if (!canPerform) {
			return fail(403, { message: 'Unauthorized' });
		}

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
			await db
				.update(auctionListings)
				.set({
					status: 'new',
					auctionId: null
				})
				.where(eq(auctionListings.id, listing.id));

			await db.insert(auctionListingHistory).values({
				event: 'status_updated',
				listingId: listing.id,
				message: 'Auction deleted, listing status returned to new.'
			});
		}

		await db.delete(auctions).where(eq(auctions.id, record.id));

		return redirect(303, '/auctions');
	}
};
