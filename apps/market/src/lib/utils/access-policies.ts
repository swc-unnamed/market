import type { Role } from '$lib/database/prisma';

export const GlobalPatronAccessPolicy: Role[] = ['Patron', 'Auctioneer', 'Developer', 'Tzar'];

export const GlobalAuctioneerAccessPolicy: Role[] = ['Auctioneer', 'Developer', 'Tzar'];

export const GlobalAdminAccessPolicy: Role[] = ['Developer', 'Tzar'];
