import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import axios from 'axios';
import type { Character } from '$lib/models/combine/character';
import { db } from '$lib/server/db/index.js';
import { getTableColumns } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { users } from '$lib/server/db/schema/users.js';
import { dev } from '$app/environment';

async function getUserFromSwc(code: string) {
	const params = new URLSearchParams();
	params.append('client_id', env.COMBINE_CLIENT_ID);
	params.append('client_secret', env.COMBINE_SECRET_KEY);
	params.append('code', code);
	params.append('grant_type', 'authorization_code');
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

	return {
		name: user.swcapi.character.name,
		combineId: user.swcapi.character.uid,
		avatar: user.swcapi.character.image,
		joinDate: new Date(),
		scopes: data.scope
	};
}

function makeImpersonatedUser(devHandle: string, devUid: string) {
	return {
		name: devHandle,
		combineId: devUid,
		avatar: '',
		scopes: 'character_read'
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

	const uimUser = await db
		.insert(users)
		.values({
			name: user.name,
			combineId: user.combineId,
			avatar: user.avatar,
			joinDate: new Date(),
			scopes: formattedScopes
		})
		.onConflictDoUpdate({
			target: [users.combineId],
			set: {
				name: user.name,
				scopes: formattedScopes,
				...((user.avatar && { avatar: user.avatar }) || {})
			}
		})
		.returning({ ...getTableColumns(users) });

	const token = jwt.sign(
		{
			id: uimUser[0].id
		},
		env.UIM_AUTH_KEY,
		{
			expiresIn: '2w'
		}
	);

	cookies.set('uim_session', token, {
		path: '/',
		httpOnly: true,
		expires: new Date(Date.now() + 12096e5)
	});

	redirect(303, '/home');
};
