import { Prisma, PrismaClient } from '@prisma/client';

const extentions = Prisma.defineExtension((client) => {
	return client
		.$extends({
			name: 'onRecordAuctionListingSale',
			model: {
				auctionListing: {
					/**
					 * Record a sale of an auction listing and broadcast the event
					 * @param args {Prisma.AuctionListingUpdateArgs}
					 * @returns
					 */
					async recordSale(args: Prisma.AuctionListingUpdateArgs) {
						const context = Prisma.getExtensionContext(this);

						const result = await context.update({
							where: { id: args.where.id },
							data: {
								status: 'sold',
								winningBidderId: args.data.winningBidderId,
								winningBid: args.data.winningBid
							}
						});

						// TODO: Trigger redis pub/sub event

						return result;
					}
				}
			}
		})
		.$extends({
			name: 'onAuctionListingCreate',
			query: {
				auctionListing: {
					async create({ args, query }) {
						const result = await query(args);
						// TODO: Trigger redis pub/sub event
						return result;
					}
				}
			}
		});
});

const prisma = new PrismaClient().$extends(extentions);

export { prisma };
