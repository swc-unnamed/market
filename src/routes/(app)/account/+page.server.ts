import { db } from '$lib/database/db.js'
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const user = await db.user.findUnique({
    where: {
      id: locals.user.id
    },
    include: {
      ownedOrganizations: true,
      profile: true,
      settings: true
    }
  });

  if (!user) {
    return error(404, {
      message: 'User not found'
    });
  }

  if (!user.profile) {
    return error(404, {
      message: 'Profile not found'
    });
  }

  return {
    account: user
  }
}