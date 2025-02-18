import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import axios from 'axios';
import type { Character } from '$lib/models/combine/character';
import jwt from 'jsonwebtoken';
import { dev } from '$app/environment';
import { Encryption } from '$lib/server/utils/encryption.js';

import { prisma } from '$lib/prisma';

async function getUserFromSwc(code: string) {
	const params = new URLSearchParams();
	params.append('client_id', env.COMBINE_CLIENT_ID);
	params.append('client_secret', env.COMBINE_SECRET_KEY);
	params.append('code', code);
	params.append('grant_type', 'authorization_code');
	params.append('access_type', 'offline');
	params.append('redirect_uri', `${env.UIM_BASE_URL}/callback`);

	const { data } = await axios.post('https://www.swcombine.com/ws/oauth2/token/', params, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	const { data: user } = await axios.get<Character>('https://www.swcombine.com/ws/v2.0/character', {
		headers: {
			Authorization: `OAuth ${data.access_token}`
		}
	});

	const encryption = new Encryption();
	const encryptedRefreshToken = encryption.encrypt(data.refresh_token);
	const timeNow = Date.now();

	const refreshExpireTime = timeNow + data.expires_in * 1000 + 2592000 * 1000;

	const encryptedAccessToken = encryption.encrypt(data.access_token);
	const accessTokenExpireTime = timeNow + data.expires_in * 1000;

	return {
		name: user.swcapi.character.name,
		combineId: user.swcapi.character.uid,
		avatar: user.swcapi.character.image,
		joinDate: new Date(),
		scopes: data.scope,
		refreshToken: encryptedRefreshToken,
		refreshTokenExpires: refreshExpireTime,
		accessToken: encryptedAccessToken,
		accessTokenExpires: accessTokenExpireTime
	};
}

function makeImpersonatedUser(devHandle: string, devUid: string) {
	return {
		name: devHandle,
		combineId: devUid,
		avatar: '',
		scopes: 'character_read',
		refreshToken: 'fake',
		refreshTokenExpires: Date.now() + 3960 * 1000,
		accessToken: 'fake',
		accessTokenExpires: Date.now() + 3960 * 1000
	};
}

export const load = async ({ url, cookies }) => {
	let user;

	const code = url.searchParams.get('code');
	if (code) {
		user ??= await getUserFromSwc(code);
	} else if (dev) {
		const devHandle = url.searchParams.get('dev_handle');
		const devUid = url.searchParams.get('dev_uid');
		if (devHandle && devUid) {
			user ??= makeImpersonatedUser(devHandle, devUid);
		}
	}

	if (!user) {
		redirect(303, '/login');
	}

	const formattedScopes = user.scopes.split(' ').map((s: string) => s);

	const u = await prisma.user.upsert({
		where: {
			combineId: user.combineId
		},
		create: {
			name: user.name,
			combineId: user.combineId,
			avatar: user.avatar,
			joinDate: new Date(),
			scopes: formattedScopes
		},
		update: {
			name: user.name,
			avatar: user.avatar,
			scopes: formattedScopes
		}
	});

	const token = jwt.sign({ id: u.id }, env.UIM_AUTH_KEY, { expiresIn: '2w' });

	cookies.set('um_session', token, {
		path: '/',
		httpOnly: true,
		expires: new Date(Date.now() + 12096e5)
	});

	cookies.set('um_combine_access_token', user.accessToken, {
		path: '/',
		httpOnly: true,
		expires: new Date(user.accessTokenExpires)
	});

	cookies.set('um_combine_refresh_token', user.refreshToken, {
		path: '/',
		httpOnly: true,
		expires: new Date(user.refreshTokenExpires)
	});

	const state = url.searchParams.get('state') as string;
	if (state === 'profile') {
		redirect(303, '/account/settings');
	}

	redirect(303, '/home');
};
