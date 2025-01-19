/**
 * Convert a credit string input into an integer.
 * @param creditStr {string} - Credit string to convert
 * @example
 * creditToInteger('10,000,000') // 10000000
 * @returns
 */
export function creditToInteger(creditStr: string): number {
	// Remove commas from the string
	const sanitized = creditStr.replace(/\D/g, '');

	// Parse the string to an integer
	return parseInt(sanitized, 10);
}

/**
 * Convert a credit integer input into a string.
 * This is useful for displaying credits in a human-readable format.
 * @param creditInt {number} - Credit integer to convert
 * @example
 * integerToCredit(10000000) // '10,000,000'
 * @returns
 */
export function integerToCredit(creditInt: number): string {
	return creditInt.toLocaleString();
}
