import { db } from '$lib/server/db/index.js';
import { auctionListings } from '$lib/server/db/schema/auction-listings.js';
import { and, desc, eq, getTableColumns, isNotNull, sql } from 'drizzle-orm';

export const load = async ({ locals, url }) => {
	const auctionEarnings = await db
		.select({
			date: sql`DATE(${auctionListings.createdAt})`.as('date'),
			value: sql`SUM(${auctionListings.purchasedPrice})`.as('value')
		})
		.from(auctionListings)
		.where(
			and(eq(auctionListings.listedById, locals.user.id), eq(auctionListings.status, 'completed'))
		)
		.groupBy(sql`DATE(${auctionListings.createdAt})`)
		.orderBy(sql`DATE(${auctionListings.createdAt})`);

	const auctionExpenses = await db
		.select({
			date: sql`DATE(${auctionListings.createdAt})`.as('date'),
			value: sql`SUM(${auctionListings.purchasedPrice})`.as('value')
		})
		.from(auctionListings)
		.where(
			and(
				eq(auctionListings.purchasedById, locals.user.id),
				eq(auctionListings.status, 'completed')
			)
		)
		.groupBy(sql`DATE(${auctionListings.createdAt})`)
		.orderBy(sql`DATE(${auctionListings.createdAt})`);

	const averageEarnings = await db
		.select({
			date: sql`DATE(${auctionListings.createdAt})`.as('date'),
			value: sql`AVG(${auctionListings.purchasedPrice})`.as('value')
		})
		.from(auctionListings)
		.groupBy(sql`DATE(${auctionListings.createdAt})`)
		.orderBy(sql`DATE(${auctionListings.createdAt})`)
		.where(and(eq(auctionListings.status, 'completed')));

	console.log('auctionEarnings', auctionEarnings);

	return {
		auctions: {
			earnings: auctionEarnings.map((row) => {
				return {
					date: new Date(row.date as Date),
					value: Number(row.value)
				};
			}),
			expenses: auctionExpenses.map((row) => {
				return {
					date: new Date(row.date as Date),
					value: Number(row.value)
				};
			}),
			avgEarnings: averageEarnings.map((row) => {
				return {
					date: new Date(row.date as Date),
					value: Number(row.value)
				};
			})
		}
	};
};
