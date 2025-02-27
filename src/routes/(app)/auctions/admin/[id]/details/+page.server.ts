import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
import { guard } from '$lib/helpers/guard.js';
import { modifyAuctionSchema } from '$lib/models/zod/auctions/modify-auction.schema';
import { prisma } from '$lib/prisma.js';
import { error, redirect } from '@sveltejs/kit';
import { format } from 'date-fns/format';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals, params, depends }) => {
	guard(locals, AuctioneerPermissionPolicy);
	depends('auction_details');

	const record = await prisma.auction.findUnique({
		where: { id: params.id },
		include: {
			listings: {
				include: {
					items: {
						include: {
							asset: true,
							entity: true
						}
					},
					listedBy: {
						select: {
							id: true,
							name: true,
							avatar: true
						}
					},
					winningBidder: {
						select: {
							id: true,
							name: true,
							avatar: true
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

	const availableListings = await prisma.auctionListing.findMany({
		where: {
			status: 'new'
		}
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
		listingRecords: availableListings,
		form: form
	};
};

export const actions = {
	save: async ({ params, locals, request }) => {
		guard(locals, AuctioneerPermissionPolicy);

		const record = await prisma.auction.findUnique({
			where: { id: params.id },
			include: {
				listings: true
			}
		});

		if (!record) {
			return fail(404, { message: 'Auction was not found in the holochain.' });
		}

		if (record?.closed) {
			return fail(400, { message: 'Auction has already been closed.' });
		}

		const form = await superValidate(request, zod(modifyAuctionSchema));

		if (!form.valid) {
			return fail(400, {
				form: form,
				message: 'Data validation failed, holochain rejected submission.'
			});
		}

		await prisma.auction.update({
			where: { id: params.id },
			data: {
				title: form.data.title,
				startAt: new Date(form.data.startAt)
			}
		});

		const selectedListings = form.data.listings;
		const listingsToDeselect = record.listings.filter((l) => !selectedListings.includes(l.id));

		await prisma.$transaction(async (tx) => {
			for (const listing of listingsToDeselect) {
				await tx.auctionListing.update({
					where: { id: listing.id },
					data: {
						status: 'new',
						auctionId: null
					}
				});
			}

			for (const listingId of selectedListings) {
				if (record.listings.find((l) => l.id === listingId)) {
					continue;
				}

				await tx.auctionListing.update({
					where: { id: listingId },
					data: {
						status: 'selected',
						auctionId: record.id
					}
				});
			}
		});
	},

	delete: async ({ params, locals }) => {
		guard(locals, AuctioneerPermissionPolicy);

		const record = await prisma.auction.findUnique({
			where: { id: params.id },
			include: {
				listings: true
			}
		});

		if (!record) {
			return fail(404, { message: 'Auction was not found in the holochain.' });
		}

		if (record.closed) {
			return fail(400, { message: 'Auction has already been closed.' });
		}

		for (const listing of record!.listings) {
			await prisma.$transaction(async (tx) => {
				await tx.auctionListing.update({
					where: { id: listing.id },
					data: {
						status: 'new',
						auctionId: null
					}
				});
			});
		}

		await prisma.auction.delete({
			where: {
				id: record.id
			}
		});

		return redirect(303, '/auctions/admin');
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
			await prisma.auctionListing.update({
				where: { id: listingId },
				data: {
					status: 'completed'
				}
			});
		} catch (e) {
			return fail(500, { message: 'Failed to update listing status.' });
		}
	}
};
