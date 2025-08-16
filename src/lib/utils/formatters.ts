
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

/**
 * Formats a Date object into a string suitable for the `datetime-local` input type.
 * @param date The date to format
 * @returns 
 */
export function toDateTimeLocalString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Converts a string in the format used by `datetime-local` input back to a Date object.
 * @param dateTimeLocal The string in `YYYY-MM-DDTHH:MM` format
 * @returns 
 */
export function fromDateTimeLocalString(dateTimeLocal: string): Date {
  const [datePart, timePart] = dateTimeLocal.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}