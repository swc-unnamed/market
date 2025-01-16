import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import axios from 'axios';
import type { Character } from '$lib/models/combine/character';
import { db } from '$lib/server/db/index.js';
import { eq, getTableColumns } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { users } from '$lib/server/db/schema/users.js';

export const load = async ({ locals, url, cookies }) => {
	const code = url.searchParams.get('code');

	console.log(url);

	if (!code) {
		redirect(303, '/login');
	}

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

	console.log(data);

	const { data: user } = await axios.get<Character>('https://www.swcombine.com/ws/v2.0/character', {
		headers: {
			Authorization: `OAuth ${data.access_token}`
		}
	});

	const uimUser = await db
		.insert(users)
		.values({
			name: user.swcapi.character.name,
			combineId: user.swcapi.character.uid,
			avatar: user.swcapi.character.image,
			joinDate: new Date(),
			scopes: data.scope
		})
		.onConflictDoUpdate({
			target: [users.combineId],
			set: {
				name: user.swcapi.character.name,
				scopes: data.scope,
				avatar: user.swcapi.character.image
			}
		})
		.returning({ ...getTableColumns(users) });
	let token = jwt.sign(
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
