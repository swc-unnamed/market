import { env } from '$env/dynamic/private';
import { db } from '$lib/database/db.js';
import { GlobalAuctioneerAccessPolicy } from '$lib/utils/access-policies'
import { guard } from '$lib/utils/guard.js'
import { json } from '@sveltejs/kit'
import { EmbedBuilder, WebhookClient } from 'discord.js';

export const POST = async ({ locals, params }) => {
  if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
    return json({ message: 'Access denied' }, { status: 403 });
  }

  const listing = await db.auctionListing.findUnique({
    where: { id: params.listingId },
    include: {
      items: {
        include: {
          entity: true
        }
      },
      liveAuction: true
    }
  });

  const settings = await db.liveAuctionSetting.findFirst({});

  if (!settings) {
    return json({ message: 'No settings found' }, { status: 400 })
  }

  if (!listing) {
    return json({ message: 'Listing not found' }, { status: 404 });
  }

  if (listing.liveAuction?.status === 'Completed' || listing.liveAuction?.status === 'Cancelled' || listing.liveAuction?.status === 'Closed') {
    return json({ message: 'Auction is not in a state to broadcast' }, { status: 400 });
  }

  const webhookClient = new WebhookClient({
    url: settings.broadcastWebhook
  });

  const embed = new EmbedBuilder()
    .setTitle(`Broacast: ${listing.title}`)
    .setDescription(listing.description || 'No description provided')
    .setURL(`${env.UM_BASE_URL}/auction-house/listings/${listing.id}`)
    .setImage(listing.items[0]?.customImage ?? listing.items[0]?.entity?.imageLarge)
    .setFields([
      {
        name: 'Number of Items',
        value: listing.items.length.toString(),
        inline: true
      },
      {
        name: 'Minimum Bid',
        value: `${listing.minimumBid.toLocaleString()} credits`,
      }
    ])
    .setFooter({
      text: 'Unnamed Market Auction House'
    });

  await webhookClient.send({
    embeds: [embed],
  })

  return json({
    success: true,
    message: 'Broadcast sent successfully',
  })
}