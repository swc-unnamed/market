export const Roles = [
	'patron',
	'auctioneer',
	'magistrate',
	'holochain_architect',
	'market_tzar'
] as const;

export type Role = (typeof Roles)[number];
