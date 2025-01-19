export const CombineScopes = [
	'character_auth',
	'character_read',
] as const;

export type CombineScope = typeof CombineScopes[number];