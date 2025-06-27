import { db } from '$lib/database/db.js';
import { auctionItemSchema, auctionListingUpdateSchema } from '$lib/models/schemas/auction-item.schema.js';
import { GlobalAdminAccessPolicy } from '$lib/utils/access-policies.js';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals }) => {
	const { id } = params;
	if (!id) {
		return error(404, {
			message: 'Listing not found'
		});
	}

	const record = await db.auctionListing.findUnique({
		where: { id: id },
		include: {
			creator: {
				include: {
					profile: true
				}
			},
			items: {
				select: {
					entityId: true,
				}
			},
		}
	});

	const recordEntities = await db.entity.findMany({
		where: {
			id: {
				in: record?.items.map(item => item.entityId) || []
			}
		},
		select: {
			id: true,
			name: true,
			imageSmall: true,
			auctionItems: {
				where: {
					listingId: id
				}
			}
		}
	});

	if (!record) {
		return error(404, {
			message: 'Listing not found'
		});
	}

	if (record.status === 'Draft') {
		let authorized = false;
		if (record.creatorId == locals.user.id) {
			authorized = true;
		}

		if (GlobalAdminAccessPolicy.includes(locals.user.role)) {
			authorized = true;
		}

		if (!authorized) {
			return error(403, {
				message: 'You do not have permission to view this listing.'
			});
		}
	}

	const itemForm = await superValidate(zod(auctionItemSchema))

	const listingForm = await superValidate(zod(auctionListingUpdateSchema))

	const formattedMinimumBid = record.minimumBid.toLocaleString('en-US', {
		minimumFractionDigits: 0,
	});

	listingForm.data = {
		title: record.title,
		description: record.description,
		location: record.location,
		minimumBid: formattedMinimumBid,
		anonymous: record.anonymous,
		creditsRecipient: record.creditsRecipient || locals.user.profile.displayName
	}

	const entities = await db.entity.findMany({});

	return {
		listing: record,
		listingEntities: recordEntities,
		itemForm: itemForm,
		listingForm: listingForm,
		entities: entities
	}
}

export const actions = {
	add_item: async ({ params, request }) => {
		const { id } = params;

		const form = await superValidate(request, zod(auctionItemSchema));

		console.log('Form data:', form.data);

		await db.auctionListingItem.create({
			data: {
				name: form.data.name,
				quantity: form.data.quantity,
				unique: form.data.unique,
				uuu: form.data.uuu,
				entity: {
					connect: {
						id: form.data.entityId
					}
				},
				listing: {
					connect: {
						id: id
					}
				}
			}
		});

		return {
			itemForm: form,
			id: id
		}
	},

	save_listing: async ({ params, request, locals }) => {
		const { id } = params;

		const record = await db.auctionListing.findUnique({
			where: { id: id },
		});

		if (!record) {
			return error(404, {
				message: 'Listing not found'
			});
		}

		if (record.status != 'Draft') {
			return error(403, {
				message: 'You can only delete draft listings.'
			});
		}

		let authorized = false;
		if (record.creatorId == locals.user.id) {
			authorized = true;
		}

		if (GlobalAdminAccessPolicy.includes(locals.user.role)) {
			authorized = true;
		}

		if (!authorized) {
			return error(403, {
				message: 'You do not have permission to edit this listing.'
			});
		}

		const form = await superValidate(request, zod(auctionListingUpdateSchema));

		if (!form.valid) {
			return {
				listingForm: form,
				error: 'Invalid form data'
			};
		}

		await db.auctionListing.update({
			where: { id: id },
			data: {
				title: form.data.title,
				description: form.data.description,
				location: form.data.location,
				minimumBid: Number(form.data.minimumBid.replace(/,/g, '')),
				anonymous: form.data.anonymous,
				creditsRecipient: form.data.creditsRecipient
			}
		});

		return {
			listingForm: form,
			id: id
		};
	},

	delete_listing: async ({ params, locals }) => {
		const { id } = params;

		const record = await db.auctionListing.findUnique({
			where: { id: id },
		});

		if (!record) {
			return error(404, {
				message: 'Listing not found'
			});
		}

		if (record.status != 'Draft') {
			return error(403, {
				message: 'You can only delete draft listings.'
			});
		}

		let authorized = false;
		if (record.creatorId == locals.user.id) {
			authorized = true;
		}

		if (GlobalAdminAccessPolicy.includes(locals.user.role)) {
			authorized = true;
		}

		if (!authorized) {
			return error(403, {
				message: 'You do not have permission to edit this listing.'
			});
		}

		await db.auctionListingItem.deleteMany({
			where: {
				listingId: id
			}
		});

		await db.auctionListing.delete({
			where: { id: id }
		});

		return redirect(303, '/auction-house/dashboard');
	},

	publish_listing: async ({ params, locals }) => {
		const { id } = params;

		const record = await db.auctionListing.findUnique({
			where: { id: id },
		});

		if (!record) {
			return error(404, {
				message: 'Listing not found'
			});
		}

		if (record.status != 'Draft') {
			return error(403, {
				message: 'You can only delete draft listings.'
			});
		}

		let authorized = false;
		if (record.creatorId == locals.user.id) {
			authorized = true;
		}

		if (GlobalAdminAccessPolicy.includes(locals.user.role)) {
			authorized = true;
		}

		if (!authorized) {
			return error(403, {
				message: 'You do not have permission to edit this listing.'
			});
		}

		console.log('Publishing listing:', id);

		await db.auctionListing.update({
			where: {
				id: id
			},
			data: {
				status: 'Active',
			}
		});

		return redirect(303, `/auction-house/listings/${id}`);
	}
}