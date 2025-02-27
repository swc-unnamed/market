import type { CombinedInventoryResponse } from '$lib/models/general/combined-inventory.response';
import { prisma } from '$lib/prisma.js';
import { error, json } from '@sveltejs/kit';
import { message } from 'sveltekit-superforms';

export const POST = async ({ locals, request, params }) => {
	const listing = await prisma.auctionListing.findUnique({
		where: { id: params.id },
		include: {
			items: {
				include: {
					asset: true
				}
			}
		}
	});

	if (!listing) {
		throw error(404, 'Listing not found');
	}

	if (listing.status !== 'draft' && listing.status !== 'new') {
		throw error(400, 'Listing is not in a draft or new state');
	}

	if (listing.listedById !== locals.user.id) {
		throw error(403, 'User does not own this listing');
	}

	const body: { data: CombinedInventoryResponse[] } = await request.json();

	const assetIds: string[] = [];

	for (const entity of body.data) {
		if (listing.items.some((item) => item.asset?.combineId === entity.uid)) {
			continue;
		}

		const entityRecord = await prisma.entity.findFirst({
			where: { uid: entity.entity.uid }
		});

		if (!entityRecord) {
			throw error(500, { message: 'Entity not found on the holochain. Contact Unnamed Support.' });
		}

		const assetRecord = await prisma.asset.findUnique({
			where: { combineId: entity.uid },
			include: {
				auctionListingItems: {
					include: {
						auctionListing: true
					}
				}
			}
		});

		if (assetRecord) {
			for (const item of assetRecord.auctionListingItems) {
				if (
					item.auctionListing.status === 'new' ||
					item.auctionListing.status === 'draft' ||
					item.auctionListing.status === 'selected'
				) {
					throw error(400, {
						message: `Asset is listed in ALID ${item.auctionListing.listingNumber} and is not in a state where you can import it into this listing.`
					});
				}
			}

			await prisma.asset.update({
				where: { combineId: entity.uid },
				data: {
					customImageSmall: entity.images.customSmall,
					customImageLarge: entity.images.customLarge
				}
			});

			let isUUU = entity.wrecked === 'no';

			if (entity.protected) {
				isUUU = entity.protected === 'no';
			}

			await prisma.auctionListingItem.create({
				data: {
					assetId: assetRecord.id,
					entityId: entityRecord.id,
					auctionListingId: listing.id,
					combineImported: true,
					quantity: entity.quantity,
					uuu: isUUU
				}
			});

			assetIds.push(assetRecord.id);
		} else {
			const newAssetRecord = await prisma.asset.create({
				data: {
					combineId: entity.uid,
					type: entityRecord.type,
					entityId: entityRecord.id,
					customImageSmall: entity.images.customSmall,
					customImageLarge: entity.images.customLarge,
					customImage: entity.images.customLarge
				}
			});

			let isUUU = entity.wrecked === 'no';

			if (entity.protected) {
				isUUU = entity.protected === 'no';
			}

			await prisma.auctionListingItem.create({
				data: {
					assetId: newAssetRecord.id,
					entityId: entityRecord.id,
					auctionListingId: listing.id,
					combineImported: true,
					quantity: entity.quantity,
					uuu: isUUU
				}
			});

			assetIds.push(newAssetRecord.id);
		}

		await prisma.entity.update({
			where: { id: entityRecord.id },
			data: {
				imageSmall: entity.images.small,
				imageLarge: entity.images.large
			}
		});
	}

	await prisma.notification.create({
		data: {
			category: 'auction',
			userId: listing.listedById,
			message: `Imported ${assetIds.length} assets to ALID ${listing.listingNumber}. These assets are now in the holochain.`,
			href: `/auctions/listings/${listing.id}`
		}
	});

	return json({ success: true, message: `Holochain updated for ALID ${listing.listingNumber}` });
};
