import { env } from '$env/dynamic/private';
import { AuctioneerPermissionPolicy } from '$lib/consts/permission-policies.js';
import { guard } from '$lib/helpers/guard.js';
import { prisma } from '$lib/prisma.js';
import { error } from '@sveltejs/kit';
import axios from 'axios';
import { asc, eq } from 'drizzle-orm';

export const load = async ({ locals, params, depends }) => {
	guard(locals, AuctioneerPermissionPolicy);

	depends('auction:live');

	const record = await prisma.auction.findUnique({
		where: {
			id: params.id
		},
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

	const users = await prisma.user.findMany({
		where: {
			banned: false
		},
		select: {
			id: true,
			name: true
		}
	});

	const settingsRecord = await prisma.systemSetting.findFirst();

	const canSendToDiscord = settingsRecord?.auctionWebhookUrl ? true : false;

	return {
		record: record,
		users: users,
		canSendToDiscord: canSendToDiscord
	};
};

export const actions = {
	end: async ({ params, locals }) => {
		guard(locals, AuctioneerPermissionPolicy);

		await prisma.auction.update({
			where: {
				id: params.id
			},
			data: {
				closedAt: new Date(),
				closed: true
			}
		});

		return {
			message: 'Auction has been ended.'
		};
	},
	sendToDiscord: async ({ locals, request }) => {
		guard(locals, AuctioneerPermissionPolicy);

		// read the body of the request
		const body = await request.formData();

		const settings = await prisma.systemSetting.findFirst();

		if (!settings?.auctionWebhookUrl) {
			return error(400, { message: 'No webhook URL set in the system settings.' });
		}

		const listing = await prisma.auctionListing.findUnique({
			where: { id: body.get('listingId') as string },
			include: {
				items: {
					include: {
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
            ${listing?.startingBid}

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
							value: item.entity.name,
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
