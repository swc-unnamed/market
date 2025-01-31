import { env } from '$env/dynamic/private';
import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
import { db } from '$lib/server/db';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { auctions } from '$lib/server/db/schema/auctions.js';
import { verifyRole } from '$lib/server/utils/verify-role.js';
import { error } from '@sveltejs/kit';
import axios from 'axios';
import { asc } from 'drizzle-orm';

export const load = async ({ locals, params, depends }) => {
	verifyRole({
		userRole: locals.user.role,
		allowedRoles: AuctioneerPermissionPolicy,
		redirectTo: '/auctions'
	});

	depends('auction:live');

	const record = await db.query.auctions.findFirst({
		where: (r, { eq }) => eq(r.id, params.id),
		with: {
			listings: {
				orderBy: asc(auctionListings.listingNumber),
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
							name: true,
							avatar: true
						}
					},
					purchasedBy: {
						columns: {
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

	const users = await db.query.users.findMany({
		where: (r, { eq }) => eq(r.banned, false),
		columns: {
			id: true,
			name: true
		}
	});

	const settingsRecord = await db.query.systemSettings.findFirst();
	const canSendToDiscord = settingsRecord?.auctionWebhookUrl ? true : false;

	return {
		record: record,
		users: users,
		canSendToDiscord: canSendToDiscord
	};
};

export const actions = {
	end: async ({ params, locals }) => {
		const canEndAuction = verifyRole({
			userRole: locals.user.role,
			allowedRoles: AuctioneerPermissionPolicy,
			noRedirect: true
		});

		if (!canEndAuction) {
			return error(403, {
				message: 'You do not have permission to end an auction.'
			});
		}

		await db.update(auctions).set({
			completedAt: new Date()
		});

		return {
			message: 'Auction has been ended.'
		};
	},
	sendToDiscord: async ({ locals, request }) => {
		const canEndAuction = verifyRole({
			userRole: locals.user.role,
			allowedRoles: AuctioneerPermissionPolicy,
			noRedirect: true
		});

		if (!canEndAuction) {
			return error(403, {
				message: 'You do not have permission to end an auction.'
			});
		}

		// read the body of the request
		const body = await request.formData();

		const settings = await db.query.systemSettings.findFirst();

		if (!settings?.auctionWebhookUrl) {
			return error(400, { message: 'No webhook URL set in the system settings.' });
		}

		const listing = await db.query.auctionListings.findFirst({
			where: (r, { eq }) => eq(r.id, body.get('listingId') as string),
			with: {
				items: {
					with: {
						asset: true,
						entity: true
					}
				}
			}
		});

		const embed = {
			embeds: [
				{
					title: listing?.title,
					description: `
             **Starting Bid**: 
            ${listing?.startingPrice}

            **Location**:
            ${listing?.location}
          `,
					url: `${env.UIM_BASE_URL}/auctions/listings/${listing?.id}`,
					author: {
						name: 'Unnamed Market',
						icon_url: `${env.UIM_BASE_URL}/assets/uim-18.png`
					},
					fields: listing?.items.map((item) => {
						return {
							name: 'Item',
							value: item.customItemName ? item.customItemName : item.entity?.name,
							inline: true
						};
					}),
					thumbnail: {
						url: `${env.UIM_BASE_URL}/assets/uim-18.png`
					},
					image: {
						url: `${env.UIM_BASE_URL}/assets/unnamed-banner.png`
					},
					footer: {
						text: 'Unnamed Market - Your gateway to the holochain',
						icon_url: `${env.UIM_BASE_URL}/assets/uim-18.png`
					},
					timestamp: new Date()
				}
			]
		};

		const data = await axios.post(settings?.auctionWebhookUrl, embed);
	}
};
