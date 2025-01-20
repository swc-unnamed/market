import { newAuctionSchema } from '$lib/models/zod/auctions';
import { db } from '$lib/server/db/index.js';
import { auctionListingHistory } from '$lib/server/db/schema/auction-listing-history.js';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { auctions } from '$lib/server/db/schema/auctions.js';
import { verifyRole } from '$lib/server/utils/verify-role';
import { eq } from 'drizzle-orm';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
	verifyRole({
		userRole: locals.user.role,
		allowedRoles: ['auctioneer', 'magistrate', 'holochain_architect', 'market_tzar']
	});

	const listingRecords = await db.query.auctionListings.findMany({
		where: (r, { eq }) => eq(r.status, 'new')
	});

	const form = await superValidate(zod(newAuctionSchema));

	return {
		listingRecords: listingRecords,
		form: form
	};
};

export const actions = {
	create: async ({ locals, request }) => {
		verifyRole({
			userRole: locals.user.role,
			allowedRoles: ['auctioneer', 'magistrate', 'holochain_architect', 'market_tzar']
		});

		const form = await superValidate(request, zod(newAuctionSchema));

		if (!form.valid) {
			return fail(400, {
				form: form,
				message: 'Data validation failed, holochain rejected submission.'
			});
		}

		await db.transaction(async (tx) => {
			const auction = await tx
				.insert(auctions)
				.values({
					createdById: locals.user.id,
					startAt: new Date(form.data.startAt),
					title: form.data.title
				})
				.returning({ id: auctions.id });

			for (const listingId of form.data.listings) {
				await tx
					.update(auctionListings)
					.set({
						auctionId: auction[0].id,
						status: 'selected'
					})
					.where(eq(auctionListings.id, listingId));

				await tx.insert(auctionListingHistory).values({
					event: 'status_updated',
					listingId: listingId,
					message: `Has been selected for auction.`
				});
			}
		});

		return {
			form: form
		};
	}
};
