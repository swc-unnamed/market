import type { Role } from '$lib/consts/roles';

/**
 * Format a role to a human-readable string
 * @param role {Role} Role to format
 * @returns {string} Formatted role
 */
export function formatRole(role: Role): string {
	switch (role) {
		case 'market_tzar':
			return 'Market Tzar';
		case 'auctioneer':
			return 'Auctioneer';
		case 'holochain_architect':
			return 'Holochain Architect';
		case 'magistrate':
			return 'Magistrate';
		case 'patron':
			return 'Patron';

		default:
			return 'Patron';
	}
}
