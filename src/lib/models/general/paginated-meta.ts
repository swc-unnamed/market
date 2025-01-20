/**
 * PaginatedMeta
 */
export interface PaginatedMeta {
	/**
	 * Current page
	 */
	page: number;

	/**
	 * Maximum number of records per page
	 */
	maxPerPage: number;

	/**
	 * Number of records on the current page
	 */
	pageSize: number;

	/**
	 * Total number of records
	 */
	totalPages: number;
}
