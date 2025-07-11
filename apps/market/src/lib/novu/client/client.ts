import { Novu } from '@novu/js';

let client: Novu | null = null;

export type GetNovuClientOptions = {
  appId: string;
  subscriberId: string;
  apiUrl: string;
}
export const getNovuClient = (options: GetNovuClientOptions): Novu => {
  if (client) {
    return client;
  }

  const { appId, subscriberId, apiUrl } = options;

  client = new Novu({
    applicationIdentifier: appId,
    subscriberId: subscriberId,
    apiUrl: apiUrl,
  });

  return client;
}