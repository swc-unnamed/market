import { form, getRequestEvent } from "$app/server";
import { AuctionLiveStatus, db } from "$lib/database/db";
import { GlobalAuctioneerAccessPolicy } from "$lib/utils/access-policies";
import { guard } from "$lib/utils/guard";
import { fail } from "@sveltejs/kit";
import { ezValidate } from "svelte-ez-form";
import z from "zod";

const schema = z.object({
  id: z.string(),
  startTime: z.date({ message: 'Start time must be a valid date', coerce: true }),
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().nullable().optional(),
  moderatorId: z.string().min(1, { message: 'Moderator is required' }),
  status: z.nativeEnum(AuctionLiveStatus, { message: 'Invalid auction status' }),
  endedAt: z.date().nullable().optional()
});

export const updateAuction = form(async (data) => {
  const { locals } = getRequestEvent();
  if (!guard(locals, GlobalAuctioneerAccessPolicy)) {
    throw fail(403, { message: 'Unauthorized' });
  }

  return ezValidate(schema, data, {
    onSuccess: async (d) => {
      await db.auctionLive.update({
        where: { id: d.id },
        data: {
          startTime: d.startTime,
          title: d.title,
          description: d.description,
          moderatorId: d.moderatorId,
          status: d.status
        }
      });
    },
    onError: (errors) => {
      console.error('Validation errors:', errors);
    }
  })
})