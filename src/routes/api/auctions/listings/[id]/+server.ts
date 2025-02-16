import { MagistratePermissionPolicy } from '$lib/consts/permission-policies.js';
import { guard } from '$lib/helpers/guard.js';
import type { PublishListingRequest } from '$lib/models/auctions/publish-listing.req.js';
import { publishListingSchema } from '$lib/models/zod/auctions/listings/publish-listing.schema.js';
import { prisma } from '$lib/prisma.js';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

export const DELETE = async ({ locals, params }) => {
	const { id } = params;

	const record = await prisma.auctionListing.findUnique({
		where: { id: id },
		include: {
			items: {
				include: {
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
		guard(locals, MagistratePermissionPolicy, 'You do not have permission to modify this listing');
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

	await prisma.$transaction(async (tx) => {
		for (const item of record.items) {
			if (item.assetId) {
				await tx.asset.update({
					where: { id: item.assetId },
					data: {
						auctionListingItems: {
							disconnect: {
								id: item.auctionListingId
							}
						}
					}
				});
			}
		}

		await tx.auctionListing.delete({
			where: {
				id: id
			}
		});

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

	const record = await prisma.auctionListing.findUnique({
		where: { id: id },
		include: {
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

	try {
		const parsed = publishListingSchema.parse(record);

		// Validation passed
	} catch (err) {
		if (err instanceof z.ZodError) {
			console.log('Validation error', err.errors);
			return error(400, 'Validation error.');
		}
	}

	await prisma.$transaction(async (tx) => {
		await tx.auctionListing.update({
			where: { id: id },
			data: {
				status: 'new'
			}
		});

		for (const item of record.items) {
			if (item.assetId) {
				await tx.assetLedger.create({
					data: {
						action: 'auction_listed',
						assetId: item.assetId
					}
				});
			}
		}
	});

	return json({
		status: 200,
		message: 'Listing has been published to the holochain.'
	});
};
