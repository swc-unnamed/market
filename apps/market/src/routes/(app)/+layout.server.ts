import { novuClient } from '$lib/novu/server/client.server.js';

export const load = async ({ locals }) => {

  await novuClient().subscribers.properties.updateOnlineFlag({
    isOnline: true
  }, locals.user.id)

  return {
    user: locals.user,
    termina: locals.terminal
  };
};
