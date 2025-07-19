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

  const auction = await db.auctionLive.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: {
          listings: true,
        }
      },
      moderator: {
        select: {
          profile: {
            select: {
              id: true,
              displayName: true,
              avatar: true
            }
          }
        }
      }
    }
  });

  if (!auction) {
    return json({ message: 'Auction not found' }, { status: 404 });
  }

  const settings = await db.liveAuctionSetting.findFirst({});

  if (!settings) {
    return json({ message: 'No settings found' }, { status: 400 })
  }

  if (auction.status === 'Completed' || auction.status === 'Cancelled' || auction.status === 'Closed') {
    return json({ message: 'Auction is not in a state to broadcast' }, { status: 400 });
  }

  const webhookClient = new WebhookClient({
    url: settings.broadcastWebhook
  });

  const embed = new EmbedBuilder()
    .setTitle(`Broacast: ${auction.title}`)
    .setDescription('A new broadcast has been sent for the live auction')
    .setAuthor({
      name: auction.moderator?.profile?.displayName || 'Auction Moderator',
      iconURL: auction.moderator?.profile?.avatar ?? undefined,
    })
    .setURL(`${env.UM_BASE_URL}/auction-house/auctions/${auction.id}`)
    .setFields([
      {
        name: 'Number of Listings',
        value: auction._count.listings.toString(),
        inline: true
      },
      {
        name: 'Start Time',
        value: new Date(auction.startTime).toLocaleString(),
      }
    ])
    .setFooter({
      text: 'Unnamed Market Auction House'
    })

  await webhookClient.send({
    embeds: [embed],
  })

  return json({
    success: true,
    message: 'Broadcast sent successfully',
  })
}