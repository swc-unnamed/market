import { novuClient } from '$lib/novu/server/client.server.js';

export const load = async ({ locals }) => {

  try {
    await novuClient().subscribers.properties.updateOnlineFlag({
      isOnline: true
    }, locals.user.id)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  }

  return {
    user: locals.user,
    terminal: locals.terminal
  };
};
