import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { redirect, type Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
	// Obtain the session token from the cookies
	const sessionToken = event.cookies.get('uim_session');

	// These routes do not require authentication to access
	const anonRoutes = ['/login', '/callback', '/api/combine/handlecheck'];

	// Resolve the event if the route is an anonymous route
	if (anonRoutes.includes(event.url.pathname)) {
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

		// Find the user record in the database
		const userRecord = await db.query.users.findFirst({
			where: (q, { eq }) => eq(q.id, decoded.id)
		});

		if (!userRecord) {
			return redirect(303, '/login');
		}

		if (userRecord.banned) {
			return redirect(303, `/login?banned=true`);
		}

		// Attach the user record to the event
		event.locals.user = {
			id: userRecord.id,
			name: userRecord.name,
			avatar: userRecord.avatar,
			role: userRecord.role
		};

		return await resolve(event);
	} catch (e) {
		console.error(e);
		return redirect(303, '/login');
	}
};
