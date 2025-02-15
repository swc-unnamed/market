import { prisma } from '$lib/prisma.js';

export const load = async ({ locals }) => {
	const records = await prisma.auctionListing.findMany({
		where: {
			status: {
				in: ['new', 'selected']
			}
		},
		orderBy: {
			listingNumber: 'asc'
		},
		include: {
			items: {
				include: {
					asset: true,
					entity: true
				}
			},
			listedBy: {
				select: {
					id: true,
					name: true,
					avatar: true
				}
			}
		}
	});

	const filteredRecords = records.map((record) => {
		if (record.anonymousListing) {
			const { listedBy, ...rest } = record;
			return rest;
		}

		return record;
	});

	const assetLedger = await prisma.assetLedger.findMany({
		where: {
			time: {
				gte: new Date(Date.now() - 72 * 60 * 60 * 1000)
			}
		}
	});

	return {
		records: filteredRecords,
		assetLedger: assetLedger
	};
};
