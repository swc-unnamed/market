import { prisma } from '$lib/prisma.js';
export const load = async ({ locals, url }) => {
	const auctionEarnings = await prisma.auctionListing.groupBy({
		where: {
			AND: [
				{
					listedById: locals.user.id
				},
				{
					status: 'completed'
				}
			]
		},
		by: ['createdAt'],
		_sum: {
			startingBid: true
		}
	});

	const auctionExpenses = await prisma.auctionListing.groupBy({
		where: {
			AND: [
				{
					winningBidderId: locals.user.id
				},
				{
					status: 'completed'
				}
			]
		},
		by: ['createdAt'],
		_sum: {
			winningBid: true
		}
	});

	const averageEarnings = await prisma.auctionListing.groupBy({
		where: {
			status: 'completed'
		},
		by: ['createdAt'],
		_avg: {
			winningBid: true
		}
	});

	return {
		auctions: {
			earnings: auctionEarnings.map((row) => {
				return {
					date: row.createdAt,
					value: row._sum
				};
			}),
			expenses: auctionExpenses.map((row) => {
				return {
					date: row.createdAt,
					value: row._sum
				};
			}),
			avgEarnings: averageEarnings.map((row) => {
				return {
					date: row.createdAt,
					value: row._avg
				};
			})
		}
	};
};
