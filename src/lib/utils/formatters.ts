
/**
 * Formats a number into a short string representation.
 * For example:
 * - 1,000 becomes "1.0K"
 * - 1,000,000 becomes "1.0M"
 * - 1,000,000,000 becomes "1.0B"
 * - 999 becomes "999"
 * @param value The number to format
 * @returns 
 */
export function formatNumberToShortString(value: number): string {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + 'B';
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + 'M';
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + 'K';
  } else {
    return value.toString();
  }
}