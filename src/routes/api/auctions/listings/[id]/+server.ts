import { MagistratePermissionPolicy } from '$lib/consts/permission-policies.js';
import { onNewAuctionListingHook } from '$lib/hooks/server/auctions/new-listing.hook.js';
import type { PublishListingRequest } from '$lib/models/auctions/publish-listing.req.js';
import { publishListingSchema } from '$lib/models/zod/auctions/listings/publish-listing.schema.js';
import { db } from '$lib/server/db/index.js';
import { assetLedger } from '$lib/server/db/schema/asset-ledger.js';
import { auctionListingHistory } from '$lib/server/db/schema/auction-listing-history.js';
import { auctionListingItems } from '$lib/server/db/schema/auction-listing-items.js';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { verifyRole } from '$lib/server/utils/verify-role.js';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const DELETE = async ({ locals, params }) => {
	const { id } = params;

	const record = await db.query.auctionListings.findFirst({
		where: (r, { eq }) => eq(r.id, id),
		with: {
			items: {
				with: {
					asset: true
				}
			},
			auction: true
		}
	});

	if (!record) {
		return error(404, 'Listing not found');
	}

	if (record.listedById !== locals.user.id) {
		const roleAllowsAction = verifyRole({
			userRole: locals.user.role,
			allowedRoles: MagistratePermissionPolicy,
			noRedirect: true
		});

		if (!roleAllowsAction) {
			return error(403, 'You do not have permission to modify this listing');
		}
	}

	if (record.auctionId) {
		const auctionStart = record.auction?.startAt;

		if (auctionStart && new Date(auctionStart) < new Date()) {
			return error(403, 'You cannot modify a listing after the auction has started.');
		}
	}

	let response: { status: number; message: string } = {
		status: 400,
		message: 'Unable to process your request on the holochain.'
	};

	await db.transaction(async (tx) => {
		await tx.insert(auctionListingHistory).values({
			event: 'deleted',
			listingId: record.id,
			message: `Listing delete by ${locals.user.name}. Will be available in the lister's history.`
		});

		for (const item of record.items) {
			if (item.assetId) {
				await tx.insert(assetLedger).values({
					action: 'delisted',
					assetId: item.assetId
				});
			}
		}

		await tx
			.update(auctionListings)
			.set({
				deletedAt: new Date(),
				isDeleted: true
			})
			.where(eq(auctionListings.id, id));

		response = {
			status: 200,
			message: "Listing item deleted successfully. It will be available in the lister's history."
		};
	});

	return json({ ...response });
};

export const POST = async ({ locals, params, request }) => {
	const { id } = params;

	const body: PublishListingRequest = await request.json();

	if (body.action !== 'publish') {
		return error(400, 'Bad Request');
	}

	const record = await db.query.auctionListings.findFirst({
		where: (r, { eq }) => eq(r.id, id),
		with: {
			items: true
		}
	});

	if (!record) {
		return error(404, 'Listing not found');
	}

	if (record.listedById !== locals.user.id) {
		return error(
			403,
			'You do not have permission to modify this listing. Only the lister can publish a listing.'
		);
	}

	if (record.status !== 'draft') {
		return error(400, 'Listing is already published or in a state that cannot be published.');
	}

	// Verify that the listing has all the fields required to be published

	try {
		const parsed = publishListingSchema.parse(record);

		// Validation passed
	} catch (err) {
		if (err instanceof z.ZodError) {
			console.log('Validation error', err.errors);
			return error(400, 'Validation error.');
		}
	}

	await db.transaction(async (tx) => {
		await tx
			.update(auctionListings)
			.set({
				status: 'new'
			})
			.where(eq(auctionListings.id, id));

		await tx.insert(auctionListingHistory).values({
			event: 'status_updated',
			listingId: record.id,
			message: `Listing published by ${locals.user.name}.`
		});

		for (const item of record.items) {
			if (item.assetId) {
				await tx.insert(assetLedger).values({
					action: 'listed_auction',
					assetId: item.assetId
				});
			}
		}
	});

	await onNewAuctionListingHook(record.id);

	return json({
		status: 200,
		message: 'Listing has been published to the holochain.'
	});
};
