import { command, getRequestEvent } from "$app/server";
import { db } from "$lib/database/db";
import { GlobalAuctioneerAccessPolicy } from "$lib/utils/access-policies";
import { guard } from "$lib/utils/guard";
import { EmbedBuilder, WebhookClient } from "discord.js";
import z from "zod";

export const broadcastListing = command(z.string(), async (data) => {
  const { locals } = getRequestEvent();

  if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
    return {
      success: false,
      message: 'Access denied',
    }
  }

  const settings = await db.liveAuctionSetting.findFirst({});

  const listing = await db.auctionListing.findUnique({
    where: {
      id: data
    },
    include: {
      items: {
        include: {
          entity: true
        }
      }
    }
  });

  if (!listing) {
    return {
      success: false,
      message: 'Listing not found',
    }
  }

  const embeds: EmbedBuilder[] = [];

  for (const item of listing.items) {
    const embed = new EmbedBuilder()
      .setTitle(item.name)
      .setImage(item.entity?.imageLarge || item.entity?.imageSmall || null)
      .setFields([
        {
          name: 'Custom Name',
          value: item.customName || '',
        },
        {
          name: 'Unique',
          value: item.unique ? 'Yes' : 'No',
        },
        {
          name: 'U/U/U',
          value: item.uuu ? 'Yes' : 'No',
        },
      ])
      .setFooter({
        text: `Unnamed Market Auction House`
      });

    embeds.push(embed);
  }

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
    content: `
# ${listing.title}
Details for listing **#${listing.listingNumber}**
_Bidding starts at ${listing.minimumBid.toLocaleString()} credits_
## Description
${listing.description || 'No description provided'}
## Location
${listing.location}
Items for this listing:
`,
    embeds: embeds,
  });

  return {
    success: true,
    message: 'Broadcast sent successfully',
  }
});