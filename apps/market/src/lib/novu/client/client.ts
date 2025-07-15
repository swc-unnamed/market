import { Novu } from '@novu/js';

let client: Novu | null = null;


export type GetNovuClientOptions = {
  appId: string;
  subscriberId: string;
  apiUrl: string;
  socketUrl: string;
}
export const getNovuClient = (options: GetNovuClientOptions): Novu => {
  if (client) {
    return client;
  }

  const { appId, subscriberId, apiUrl, socketUrl } = options;

  client = new Novu({
    applicationIdentifier: appId,
    subscriberId: subscriberId,
    apiUrl: apiUrl,
    socketUrl: socketUrl
  });

  return client;
}