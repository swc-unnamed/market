import { env } from '$env/dynamic/private';
import { WebhookEvent } from '$lib/consts/webhook-event';
import { db } from '$lib/server/db';
import axios from 'axios';
import { sql } from 'drizzle-orm';

/**
 * This function is called when a new auction listing is created. This will
 * send a webhook to all users who have subscribed to the event.
 *
 * Handles the `auction_listing_created` event.
 * @param id {string} Auction Listing ID
 * @returns
 */
export async function onNewAuctionListingHook(id: string) {
	const record = await db.query.auctionListings.findFirst({
		where: (r, { eq }) => eq(r.id, id),
		with: {
			items: {
				with: {
					asset: true,
					entity: true
				}
			}
		}
	});

	if (!record) {
		console.log('Auction listing was not found in the holochain.');
		return;
	}

	if (record.status != 'new') {
		console.log('Auction listing is not new.');
		return;
	}

	const availableWebhooks = await db.query.userWebhooks.findMany({
		where: (r) => sql`${r.events} @> ARRAY['auction_listing_created']::text[]`
	});

	const embed = {
		embeds: [
			{
				title: `New Auction Listing - ALID: ${record.listingNumber}`,
				description: `
              **Listing Title**:
              ${record?.title}

               **Starting Bid**: 
              ${record?.startingPrice}
  
              **Location**:
              ${record?.location}
            `,
				url: `${env.UIM_BASE_URL}/auctions/listings/${record?.id}`,
				author: {
					name: 'Unnamed Market',
					icon_url: `${env.UIM_BASE_URL}/assets/uim-18.png`
				},
				fields: record?.items.map((item) => {
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

	for (const hook of availableWebhooks) {
		await axios.post(hook.webhook, embed);
	}
}
