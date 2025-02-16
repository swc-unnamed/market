import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies';
import { guard } from '$lib/helpers/guard.js';
import { newAuctionSchema } from '$lib/models/zod/auctions';
import { prisma } from '$lib/prisma.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { SwcTimestamp } from 'swcombine.js';

export const load = async ({ locals }) => {
	guard(locals, AuctioneerPermissionPolicy);

	const listingRecords = await prisma.auctionListing.findMany({
		where: {
			status: 'new'
		}
	});

	const form = await superValidate(zod(newAuctionSchema));

	form.data.title = SwcTimestamp.now().toString('Y{y} D{d}');

	return {
		listingRecords: listingRecords,
		form: form
	};
};

export const actions = {
	create: async ({ locals, request }) => {
		guard(locals, AuctioneerPermissionPolicy);

		const form = await superValidate(request, zod(newAuctionSchema));

		if (!form.valid) {
			return fail(400, {
				form: form,
				message: 'Data validation failed, holochain rejected submission.'
			});
		}

		await prisma.$transaction(async (tx) => {
			const auction = await tx.auction.create({
				data: {
					title: form.data.title,
					startAt: new Date(form.data.startAt)
				}
			});

			for (const listingId of form.data.listings) {
				await tx.auctionListing.update({
					where: {
						id: listingId
					},
					data: {
						auctionId: auction.id,
						status: 'selected'
					}
				});
			}
		});

		return {
			form: form
		};
	}
};
