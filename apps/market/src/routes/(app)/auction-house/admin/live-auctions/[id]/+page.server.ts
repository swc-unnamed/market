import { db } from '$lib/database/db'
import { GlobalAuctioneerAccessPolicy } from '$lib/utils/access-policies.js'
import { guard } from '$lib/utils/guard.js'
import { error, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { createLiveAuctionSchema } from '../components/schemas.js'

export const load = async ({ locals, params }) => {
	if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
		return redirect(303, '/auction-house')
	}

	const auction = await db.auctionLive.findUnique({
		where: {
			id: params.id
		},
		include: {
			moderator: {
				select: {
					id: true,
					profile: {
						select: {
							id: true,
							displayName: true,
							avatar: true
						}
					}
				}
			},
			listings: {
				include: {
					items: true
				}
			}
		}
	});

	if (!auction) {
		return error(404, {
			message: 'Auction was not found.'
		})
	}

	const availableModerators = await db.user.findMany({
		where: {
			AND: [
				{
					role: {
						in: ['Auctioneer', 'Developer', 'Tzar']
					}
				},
				{
					banned: false
				}
			]
		},
		include: {
			profile: {
				select: {
					id: true,
					displayName: true,
					avatar: true
				}
			}
		}
	});

	const startTime = new Date(auction.startTime);

	const localOffset = startTime.getTimezoneOffset() * 60000;
	const localStartTime = new Date(startTime.getTime() - localOffset);
	const localFormattedStartTime = localStartTime.toISOString().slice(0, 16);


	const createAuctionForm = await superValidate(zod(createLiveAuctionSchema), {
		defaults: {
			title: auction.title,
			description: auction.description,
			startTime: localFormattedStartTime,
			moderatorId: auction.moderatorId,
			listings: auction.listings.map(listing => listing.id)
		}
	});

	return {
		auction: auction,
		createAuctionForm: createAuctionForm,
		availableModerators: availableModerators
	}
}

export const actions = {
	create: async ({ request, locals }) => {
		if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
			return redirect(303, '/auction-house')
		}

		const form = await superValidate(request, zod(createLiveAuctionSchema));

		if (!form.valid) {
			return { form };
		}

		const { title, description, startTime, moderatorId, listings } = form.data;

		console.log(new Date(startTime));

		const newAuction = await db.auctionLive.create({
			data: {
				title: title,
				description: description,
				startTime: new Date(startTime),
				moderatorId: moderatorId,
				listings: {
					connect: listings.map(id => ({ id }))
				}
			}
		});

		console.log('New Live Auction Created:', newAuction);

		return { form: { ...form, success: true }, newAuction };
	}
}