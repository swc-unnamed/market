import { command, form, getRequestEvent } from "$app/server";
import { db } from "$lib/database/db";
import { ezValidate } from 'svelte-ez-form';
import { z } from 'zod';

const schema = z.object({
  listingViewStyle: z.enum(["card", "table"], { error: 'Listing view style must be either "card" or "table"' })
});

export const settingsForm = form(async (data) => {
  return await ezValidate(schema, data, {
    onSuccess: async (validatedData) => {
      console.log("Validated settings data:", validatedData);

      const { locals } = getRequestEvent();

      const newSettings = validatedData

      console.log("Updating settings for user:", locals.user.id);

      await db.userSetting.update({
        where: {
          userId: locals.user.id
        },
        data: {
          settings: JSON.parse(JSON.stringify(newSettings))
        }
      });

      console.log("Settings updated successfully for user:", locals.user.id);
    },
    onError: (errors) => {
      console.error("Validation errors:", errors);
    }
  });
});

export const saveSettingsCommand = command(schema, async (data) => {
  const { locals } = getRequestEvent();

  await db.userSetting.update({
    where: {
      userId: locals.user.id
    },
    data: {
      settings: JSON.parse(JSON.stringify(data))
    }
  });

  return {
    success: true
  }
})