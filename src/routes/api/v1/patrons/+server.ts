import { prisma } from '$lib/prisma.js';
import { error, json } from '@sveltejs/kit';

interface UserRegistrationRequest {
	name: string;
	uid: string;
}

export const GET = async ({ request }) => {
	const unnamedToken = request.headers.get('x-unnamed-key');

	if (!unnamedToken) {
		return error(401, {
			message: 'Unauthorized.'
		});
	}

	const users = await prisma.user.findMany({
		where: {
			banned: false
		}
	});

	return json(
		users.map((user) => ({
			id: user.id,
			name: user.name,
			combineId: user.combineId,
			role: user.role
		}))
	);
};

export const POST = async ({ request }) => {
	const unnamedToken = request.headers.get('x-unnamed-key');

	if (!unnamedToken) {
		return error(401, {
			message: 'Unauthorized.'
		});
	}

	const body: UserRegistrationRequest = await request.json();

	const user = await prisma.user.findUnique({
		where: {
			combineId: body.uid
		}
	});

	if (user) {
		return error(400, {
			message: 'User already exists.'
		});
	}

	const newUser = await prisma.user.create({
		data: {
			name: body.name,
			combineId: body.uid
		}
	});

	return json({
		status: 'success',
		message: 'User has been registered.',
		data: {
			id: newUser.id,
			name: newUser.name,
			combineId: newUser.combineId
		}
	});
};
