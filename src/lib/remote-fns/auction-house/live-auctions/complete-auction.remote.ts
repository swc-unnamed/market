import { command } from "$app/server";
import { db } from "$lib/database/db";
import z from "zod";

export const completeAuction = command(z.object({
  id: z.string(),
}), async (data) => {
  const auction = await db.auctionLive.findUnique({
    where: { id: data.id },
    include: { listings: true }
  });

  if (!auction) {
    return {
      success: false,
      message: `Auction with ID ${data.id} not found.`
    }
  }

  if (auction.status !== 'Closed') {
    return {
      success: false,
      message: `Auction with ID ${data.id} is not in a state that can be completed.`
    }
  }

  let canComplete = true;
  for (const listing of auction.listings) {
    if (listing.status !== 'Complete') {
      canComplete = false;
    }
  }

  if (!canComplete) {
    return {
      success: false,
      message: `All listings must be marked Complete before the auction can be completed.`
    }
  }

  await db.auctionLive.update({
    where: { id: data.id },
    data: {
      endedAt: new Date(),
      status: 'Completed'
    }
  })

  return {
    success: true,
    message: "Status updated"
  }
})