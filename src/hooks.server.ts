import { env } from '$env/dynamic/private';
import { db } from '$lib/database/db';
import { COOKIE_UM_COMBINE_ACCESS_TOKEN, COOKIE_UM_COMBINE_REFRESH_TOKEN, COOKIE_UM_SESSION } from '$lib/models/common/cookies';
import type { JwtToken } from '$lib/models/common/jwt';
import { decrypt, encrypt } from '$lib/utils/encrypt';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import jwt from 'jsonwebtoken';
import 'dotenv/config'


function isUnauthenticatedPath(path: string): boolean {
  const unauthenticatedPaths = ['/auth/login', '/auth/callback', '/api/storage', '/api/novu'];
  return unauthenticatedPaths.some((p) => path.startsWith(p));
}

const authentication: Handle = async ({ event, resolve }) => {
  if (isUnauthenticatedPath(event.url.pathname)) {
    console.log(`Skipping auth for: ${event.url.pathname}`)
    return resolve(event);
  }

  const cookies = event.cookies;
  const session = cookies.get(COOKIE_UM_SESSION);

  if (!session) {
    throw redirect(302, '/auth/login');
  }

  const encryptedToken = session;
  const rawJwt = decrypt(encryptedToken);

  const token = jwt.verify(rawJwt, env.UM_ENCRYPTION_KEY) as JwtToken;

  const user = await db.user.findUnique({
    where: { id: token.id },
    include: {
      profile: true
    }
  });

  if (!user) {
    cookies.delete(COOKIE_UM_SESSION, { path: '/' });
    throw redirect(302, '/auth/login');
  }

  if (!user.profile) {
    cookies.delete(COOKIE_UM_SESSION, { path: '/' });
    throw redirect(302, '/auth/login');
  }

  let activeMembershipRecord;

  if (user.profile.activeMembershipId) {
    activeMembershipRecord = await db.organizationMember.findUnique({
      where: { id: user.profile.activeMembershipId },
      include: {
        organization: true
      }
    });
  }

  const organizationMemberships = await db.organizationMember.findMany({
    where: {
      profileId: user.profile.id
    },
    include: {
      organization: true
    }
  });

  event.locals.user = {
    id: user.id,
    username: user.username,
    combineId: user.combineId,
    combineScopes: user.combineScopes,
    role: user.role,
    profile: {
      id: user.profile.id,
      displayName: user.profile.displayName,
      avatar: user.profile.avatar,
      reputation: user.profile.reputation,
      activeOrganizationId: user.profile.activeMembershipId,
      activeOrganization: activeMembershipRecord ? {
        id: activeMembershipRecord.organization.id,
        name: activeMembershipRecord.organization.name,
        slug: activeMembershipRecord.organization.slug,
        logoUrl: activeMembershipRecord.organization.logoUrl,
        role: activeMembershipRecord.role
      } : null,
      memberships: organizationMemberships.map((membership) => ({
        id: membership.id,
        organization: {
          id: membership.organization.id,
          name: membership.organization.name,
          slug: membership.organization.slug,
          logoUrl: membership.organization.logoUrl,
          logoId: null,
          role: membership.role
        }
      }))
    }
  }

  event.locals.terminal = {
    appId: env.NOVU_APPLICATION_ID,
    apiUrl: env.NOVU_API_URL,
    socketUrl: env.NOVU_SOCKET_URL
  }

  return resolve(event)
};

const refreshCombineAccessTokens: Handle = async ({ event, resolve }) => {
  if (isUnauthenticatedPath(event.url.pathname)) {
    return resolve(event);
  }

  if (!event.locals.user) {
    console.error('No account found in locals');
    redirect(307, '/auth/login');
  }

  const combineAccessToken = event.cookies.get(COOKIE_UM_COMBINE_ACCESS_TOKEN);
  const combineRefreshToken = event.cookies.get(COOKIE_UM_COMBINE_REFRESH_TOKEN);

  if (combineAccessToken && combineRefreshToken) {
    return resolve(event);
  }

  if (!combineRefreshToken) {
    console.error('No Combine refresh token found');
    redirect(307, '/auth/login');
  }

  const decryptedRefreshToken = decrypt(combineRefreshToken);

  const params = new URLSearchParams();
  params.append('client_id', env.UM_COMBINE_CLIENT_ID);
  params.append('client_secret', env.UM_COMBINE_SECRET_KEY);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', decryptedRefreshToken);

  try {
    const tokenResp = await fetch('https://www.swcombine.com/ws/oauth2/token/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    if (!tokenResp.ok) {
      console.error('Failed to refresh Combine token:', tokenResp.statusText);
      redirect(307, '/auth/login');
    }
    const tokenData = await tokenResp.json();

    const encryptedAccessToken = encrypt(tokenData.access_token);
    const encryptedRefreshToken = encrypt(tokenData.refresh_token);

    event.cookies.set(COOKIE_UM_COMBINE_ACCESS_TOKEN, encryptedAccessToken, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + tokenData.expires_in * 1000)
    });

    event.cookies.set(COOKIE_UM_COMBINE_REFRESH_TOKEN, encryptedRefreshToken, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
    });
  } catch (error) {
    console.error('Failed to refresh Combine token:', error);
    redirect(307, '/auth/login');
  }

  return resolve(event);
};


export const handle = sequence(authentication, refreshCombineAccessTokens);
