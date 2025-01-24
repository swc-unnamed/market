import type { Role } from '$lib/consts/roles';

export const PatronPermissionPolicy: Role[] = [
	'patron',
	'auctioneer',
	'magistrate',
	'holochain_architect',
	'market_tzar'
];
export const AuctioneerPermissionPolicy: Role[] = [
	'auctioneer',
	'magistrate',
	'holochain_architect',
	'market_tzar'
];
export const MagistratePermissionPolicy: Role[] = [
	'magistrate',
	'holochain_architect',
	'market_tzar'
];
export const HolochainArchitectPermissionPolicy: Role[] = ['holochain_architect', 'market_tzar'];
export const MarketTzarPermissionPolicy: Role[] = ['market_tzar'];
