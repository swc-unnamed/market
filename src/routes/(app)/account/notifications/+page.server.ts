import { prisma } from '$lib/prisma.js';

export const load = async ({ locals, url }) => {
	const page = parseInt(url.searchParams.get('page') as string) || 1;

	const totalNotifications = await prisma.notification.count({
		where: {
			userId: locals.user.id
		}
	});

	const notificationsPerPage = 50;
	const totalPages = Math.ceil(totalNotifications / notificationsPerPage);

	const notifications = await prisma.notification.findMany({
		where: {
			userId: locals.user.id
		},
		take: notificationsPerPage,
		skip: (page - 1) * notificationsPerPage,
		orderBy: {
			createdAt: 'desc'
		}
	});

	return {
		meta: {
			maxPerPage: notificationsPerPage,
			page: page,
			pageSize: notifications.length,
			totalPages: totalPages
		},
		notifications: notifications
	};
};
