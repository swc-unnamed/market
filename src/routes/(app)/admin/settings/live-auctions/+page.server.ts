import { db } from '$lib/database/db.js';
import { GlobalAdminAccessPolicy } from '$lib/utils/access-policies.js'
import { guard } from '$lib/utils/guard.js'
import { fail } from '@sveltejs/kit'

export const load = async ({ locals }) => {
  if (!guard(locals, GlobalAdminAccessPolicy)) {
    return fail(403, { message: 'Access denied' });
  }

  const settings = await db.liveAuctionSetting.findFirst({})

  return {
    settings: settings
  }
}

export const actions = {
  update: async ({ locals, request }) => {
    if (!guard(locals, GlobalAdminAccessPolicy)) {
      return fail(403, { message: 'Access denied' });
    }

    const formData = await request.formData();

    const webhookUrl = formData.get('webhookUrl');

    console.log(webhookUrl);

    const settings = await db.liveAuctionSetting.findFirst({});

    if (!settings) {
      await db.liveAuctionSetting.create({
        data: {
          broadcastWebhook: webhookUrl ? webhookUrl.toString() : ''
        }
      });
    } else {
      await db.liveAuctionSetting.update({
        where: { id: settings.id },
        data: {
          broadcastWebhook: webhookUrl ? webhookUrl.toString() : ''
        }
      })
    }

    return {
      success: true,
      message: 'Settings updated successfully',
    }
  }
}