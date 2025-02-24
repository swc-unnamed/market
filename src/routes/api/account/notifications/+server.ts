import { prisma } from '$lib/prisma.js';
import { json } from '@sveltejs/kit';

export const GET = async ({ locals, url }) => {
	const user = locals.user;

	const unreadNotifications = await prisma.notification.findMany({
		where: {
			userId: user.id,
			read: false
		}
	});

	return json({
		auction: unreadNotifications.filter((n) => n.category === 'auction').length,
		market: unreadNotifications.filter((n) => n.category === 'market').length
	});
};

export const POST = async ({ locals, request }) => {
	const body: { notificationIds: string[] } = await request.json();

	if (body.notificationIds.length === 0) {
		return json({ status: 200 });
	}

	for (const id of body.notificationIds) {
		await prisma.notification.update({
			where: {
				id: id,
				userId: locals.user.id
			},
			data: { read: true }
		});
	}
	return json({ status: 200 });
};
