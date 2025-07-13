import { Novu } from '@novu/api';
import { env } from '$env/dynamic/private';

let novu: Novu | null = null;

/**
 * Gets a singleton instance of the Novu client.
 * @returns A singleton instance of the Novu client.
 */
export const novuClient = (): Novu => {
  if (!novu) {
    novu = new Novu({
      secretKey: env.NOVU_SECRET_KEY || '',
      serverURL: env.NOVU_API_URL || ''
    });
  }

  return novu;
}