import { command, getRequestEvent } from "$app/server";
import { db } from "$lib/database/db";
import { GlobalAuctioneerAccessPolicy } from "$lib/utils/access-policies";
import { guard } from "$lib/utils/guard";
import { EmbedBuilder, WebhookClient } from "discord.js";
import { env } from "process";
import { SwcTimestamp } from "swcombine.js";
import z from "zod";

export const broadcastLiveAuction = command(z.string(), async (data) => {
  const { locals } = getRequestEvent();

  if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
    return {
      success: false,
      message: 'Access denied',
    }
  }

  const auction = await db.auctionLive.findUnique({
    where: {
      id: data
    },
    include: {
      moderator: {
        include: {
          profile: true
        }
      },
      _count: {
        select: {
          listings: true
        }
      }
    }
  });

  if (!auction) {
    return {
      success: false,
      message: 'Auction not found',
    }
  }

  const settings = await db.liveAuctionSetting.findFirst({});

  const embed = new EmbedBuilder()
    .setTitle(auction.title)
    .setDescription(auction.description || 'No description provided')
    .setAuthor({
      name: auction.moderator?.profile?.displayName || 'Auction Moderator',
      iconURL: auction.moderator?.profile?.avatar ?? undefined,
    })
    .setURL(`${env.UM_BASE_URL}/auction-house/auctions/${auction.id}`)
    .setFields([
      {
        name: 'Number of Listings',
        value: auction._count.listings.toString(),
      },
      {
        name: 'Start Time - Galactic Standard Time',
        value: SwcTimestamp.fromDate(auction.startTime).toString(),
      }
    ])
    .setFooter({
      text: `Unnamed Market Auction House`
    });

  if (!settings) {
    return {
      success: false,
      message: 'No settings found',
    }
  }
  const webhookClient = new WebhookClient({
    url: settings.broadcastWebhook
  });

  await webhookClient.send({
    embeds: [embed],
  })

  return {
    success: true,
    message: 'Broadcast sent successfully',
  }

});