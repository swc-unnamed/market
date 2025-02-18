import type { CombineScope, CombineScopeMap } from '$lib/models/combine/combine-scopes';

export class CombineScopeCheck {
	userScopes: CombineScopeMap;

	constructor(scopes: string[]) {
		this.userScopes = {
			character_read: scopes.includes('character_read'),
			personal_inv_overview: scopes.includes('personal_inv_overview'),
			personal_inv_creatures_read: scopes.includes('personal_inv_creatures_read'),
			personal_inv_droids_read: scopes.includes('personal_inv_droids_read'),
			personal_inv_facilities_read: scopes.includes('personal_inv_facilities_read'),
			personal_inv_items_read: scopes.includes('personal_inv_items_read'),
			personal_inv_materials_read: scopes.includes('personal_inv_materials_read'),
			personal_inv_npcs_read: scopes.includes('personal_inv_npcs_read'),
			personal_inv_ships_read: scopes.includes('personal_inv_ships_read'),
			personal_inv_stations_read: scopes.includes('personal_inv_stations_read'),
			personal_inv_vehicles_read: scopes.includes('personal_inv_vehicles_read'),
			faction_inv_overview: scopes.includes('faction_inv_overview'),
			faction_inv_creatures_read: scopes.includes('faction_inv_creatures_read'),
			faction_inv_droids_read: scopes.includes('faction_inv_droids_read'),
			faction_inv_facilities_read: scopes.includes('faction_inv_facilities_read'),
			faction_inv_items_read: scopes.includes('faction_inv_items_read'),
			faction_inv_materials_read: scopes.includes('faction_inv_materials_read'),
			faction_inv_npcs_read: scopes.includes('faction_inv_npcs_read'),
			faction_inv_ships_read: scopes.includes('faction_inv_ships_read'),
			faction_inv_stations_read: scopes.includes('faction_inv_stations_read'),
			faction_inv_vehicles_read: scopes.includes('faction_inv_vehicles_read')
		};
	}

	/**
	 * Check if the user has a specific scope
	 * @param scope {CombineScope}
	 * @returns {boolean} True if the user has the scope
	 */
	public hasScope(scope: CombineScope): boolean {
		return this.userScopes[scope];
	}

	/**
	 * Get the user's scopes
	 * @returns {CombineScopeMap}
	 */
	public getScopes(): CombineScopeMap {
		return this.userScopes;
	}
}
