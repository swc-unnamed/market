import { env } from '$env/dynamic/private';
import { db } from '$lib/database/db';
import type { Character } from '$lib/models/combine/character';
import { COOKIE_UM_STATE, COOKIE_UM_SESSION, COOKIE_UM_COMBINE_ACCESS_TOKEN, COOKIE_UM_COMBINE_REFRESH_TOKEN } from '$lib/models/common/cookies';
import type { JwtToken } from '$lib/models/common/jwt';
import { encrypt } from '$lib/utils/encrypt';
import { redirect, type Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

type AuthenticatedCharacter = {
	character: Character;
	tokens: {
		accessToken: string;
		accessTokenExpiresAt: number;
		refreshToken: string;
		scopes: string[];
	};
};

export const GET = async ({ url, cookies }) => {
	const code = url.searchParams.get('code') as string;
	const state = url.searchParams.get('state') as string;


	let redirectTo = '/';

	if (state != 'profile') {
		//
	} else {
		redirectTo = '/account';
	}

	const character = await exchangeCode(code);

	return login(cookies, character, redirectTo);
};

/**
 * Exchange the code for a character object, this will
 * return back an authenticated character object
 * @param code {string}
 * @returns {Promise<AuthenticatedCharacter>}
 */
async function exchangeCode(code: string): Promise<AuthenticatedCharacter> {
	const params = new URLSearchParams();
	params.append('client_id', env.UM_COMBINE_CLIENT_ID);
	params.append('client_secret', env.UM_COMBINE_SECRET_KEY);
	params.append('code', code);
	params.append('grant_type', 'authorization_code');
	params.append('access_type', 'offline');
	params.append('redirect_uri', `${env.UM_BASE_URL}/auth/callback`);

	const tokenResp = await fetch('https://www.swcombine.com/ws/oauth2/token/', {
		method: 'POST',
		body: params,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	if (!tokenResp.ok) {
		redirect(307, `/auth/login?error=oauth_error`);
	}

	const tokenData = await tokenResp.json();

	const characterResp = await fetch('https://www.swcombine.com/ws/v2.0/character', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			Authorization: `OAuth ${tokenData.access_token}`
		}
	});
	if (!characterResp.ok) {
		redirect(307, `/auth/login?error=oauth_error`);
	}
	const characterData = (await characterResp.json()) as Character;

	return {
		character: characterData,
		tokens: {
			accessToken: tokenData.access_token,
			accessTokenExpiresAt: tokenData.expires_in,
			refreshToken: tokenData.refresh_token,
			scopes: tokenData.scope.split(' ')
		}
	};
}

async function login(cookies: Cookies, character: AuthenticatedCharacter, redirectTo: string) {

	const user = await db.user.upsert({
		where: {
			combineId: character.character.swcapi.character.uid,
		},
		create: {
			combineId: character.character.swcapi.character.uid,
			combineScopes: character.tokens.scopes,
			role: 'Patron',
			username: character.character.swcapi.character.name,
			profile: {
				create: {
					displayName: character.character.swcapi.character.name,
					avatar: character.character.swcapi.character.image,
					reputation: 50
				}
			}
		},
		update: {
			combineScopes: character.tokens.scopes,
			username: character.character.swcapi.character.name,
			lastLogin: new Date(),
			profile: {
				update: {
					avatar: character.character.swcapi.character.image,
				}
			}
		}
	});

	if (!user) {
		console.error('Failed to create or update user');
		redirect(307, '/auth/login?error=internal_error');
	}

	if (env.UM_REQUIRE_BETA_ACCESS) {

		const betaUser = await db.betaAccess.findFirst({
			where: {
				combineId: user.combineId
			}
		});

		if (!betaUser) {
			return redirect(307, '/auth/login?error=beta_access_required');
		}
	}

	const payload: JwtToken = { id: user.id };
	const token = jwt.sign(payload, env.UM_ENCRYPTION_KEY, {
		expiresIn: '2w'
	});

	const encryptedUnnamedToken = encrypt(token);
	const encryptedCombineAccessToken = encrypt(character.tokens.accessToken);
	const encryptedCombineRefreshToken = encrypt(character.tokens.refreshToken);

	cookies.set(COOKIE_UM_SESSION, encryptedUnnamedToken, {
		path: '/',
		httpOnly: true,
		expires: new Date(Date.now() + 60 * 60 * 24 * 14 * 1000), // 2 weeks
		secure: env.NODE_ENV === 'production'
	});

	cookies.set(COOKIE_UM_COMBINE_ACCESS_TOKEN, encryptedCombineAccessToken, {
		path: '/',
		httpOnly: true,
		expires: new Date(Date.now() + character.tokens.accessTokenExpiresAt * 1000),
		secure: env.NODE_ENV === 'production'
	});

	cookies.set(COOKIE_UM_COMBINE_REFRESH_TOKEN, encryptedCombineRefreshToken, {
		path: '/',
		httpOnly: true,
		expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
	});

	cookies.delete(COOKIE_UM_STATE, { path: '/' });

	return redirect(307, redirectTo);
}
