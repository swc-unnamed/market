import { db } from "$lib/database/db";
import { json } from "@sveltejs/kit";

export const POST = async ({ locals }) => {
  const currentDraftCount = await db.auctionListing.count({
    where: {
      AND: [
        { status: 'Draft' },
        { creatorId: locals.user.id }
      ]
    }
  });

  if (currentDraftCount >= 10) {
    return json({
      message: 'You have reached the maximum number of drafts allowed.',
    }, { status: 400, statusText: 'You have reached the maximum number of drafts.' })
  }

  const newDraft = await db.auctionListing.create({
    data: {
      creatorId: locals.user.id,
      status: 'Draft',
      title: 'New Draft',
      description: '',
      location: '',
      minimumBid: 100_000,
      creditsRecipient: locals.user.profile.displayName,
      type: 'Live',
    }
  });

  return json({
    draftId: newDraft.id
  })
}