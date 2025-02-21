import { env } from '$env/dynamic/private';
import { prisma } from '$lib/prisma';
import { Encryption } from '$lib/server/utils/encryption';
import { redirect, type Handle } from '@sveltejs/kit';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
	// Obtain the session token from the cookies
	const sessionToken = event.cookies.get('um_session');

	// These routes do not require authentication to access
	const anonRoutes = ['/login', '/callback', '/api/combine/handlecheck'];

	// Resolve the event if the route is an anonymous route
	if (anonRoutes.includes(event.url.pathname)) {
		return resolve(event);
	}

	// Api routes
	if (event.url.pathname.startsWith('/api/v1')) {
		return resolve(event);
	}

	// Routes with /p which stands for public, do not require authentication
	if (event.url.pathname.startsWith('/p')) {
		return resolve(event);
	}

	// Redirect to the login page if the session token is not present
	if (!sessionToken) {
		return redirect(303, '/login');
	}

	// Verify the session token
	try {
		// Decode the session token
		const decoded = jwt.verify(sessionToken, env.UIM_AUTH_KEY) as { id: string };

		const u = await prisma.user.findUnique({
			where: { id: decoded.id }
		});

		if (!u) {
			return redirect(303, '/login');
		}

		if (u.banned) {
			return redirect(303, `/login?banned=true`);
		}

		// Attach the user record to the event
		event.locals.user = {
			id: u.id,
			combineId: u.combineId,
			name: u.name,
			avatar: u.avatar,
			role: u.role,
			scopes: u.scopes
		};

		event.setHeaders({ 'Cache-Control': 'no-store' });

		const combineAccessToken = event.cookies.get('um_combine_access_token');
		const combineRefreshToken = event.cookies.get('um_combine_refresh_token');
		if (!combineAccessToken) {
			if (!combineRefreshToken) {
				return redirect(303, '/login');
			}

			try {
				const encryption = new Encryption();
				const refreshToken = encryption.descrypt(combineRefreshToken);
				const params = new URLSearchParams();
				params.append('client_id', env.COMBINE_CLIENT_ID);
				params.append('client_secret', env.COMBINE_SECRET_KEY);
				params.append('grant_type', 'refresh_token');
				params.append('refresh_token', refreshToken);

				const tokenData = await axios.post('https://www.swcombine.com/ws/oauth2/token/', params, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Accept: 'application/json'
					}
				});

				await prisma.user.update({
					where: { id: u.id },
					data: {
						scopes: tokenData.data.scope.split(' ').map((s: string) => s)
					}
				});

				const encryptedRefreshToken = encryption.encrypt(tokenData.data.refresh_token);
				const encryptedAccessToken = encryption.encrypt(tokenData.data.access_token);

				event.cookies.set('um_combine_access_token', encryptedAccessToken, {
					expires: new Date(Date.now() + tokenData.data.expires_in * 1000),
					path: '/',
					httpOnly: true
				});

				event.cookies.set('um_combine_refresh_token', encryptedRefreshToken, {
					expires: new Date(Date.now() + tokenData.data.expires_in * 1000 + 2592000 * 1000),
					path: '/',
					httpOnly: true
				});
			} catch (err) {
				console.error(err);
				return redirect(303, '/login');
			}
		}

		return await resolve(event);
	} catch (e) {
		console.error(e);
		return redirect(303, '/login');
	}
};
