import Fuse from 'fuse.js';

/**
 * Fuzzy search an array of objects based on keys provided
 * @param keys
 * @param data
 * @param searchTerm
 * @param threshold
 * @returns
 */
export function fuzzySearch<T>(
	keys: string[],
	data: T[],
	searchTerm: string,
	threshold?: number
): Array<T> {
	const fuse = new Fuse(data, {
		keys,
		threshold: threshold || 0.3
	});

	const result = fuse.search(searchTerm);
	const results = result.map((r) => r.item);
	return results;
}
