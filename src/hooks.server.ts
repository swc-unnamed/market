import { env } from '$env/dynamic/private';
import { prisma } from '$lib/prisma';
import { redirect, type Handle } from '@sveltejs/kit';
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
			name: u.name,
			avatar: u.avatar,
			role: u.role,
			scopes: u.scopes.join(' ')
		};

		return await resolve(event);
	} catch (e) {
		console.error(e);
		return redirect(303, '/login');
	}
};
