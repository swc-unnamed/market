/**
 * Returns a debounced version of the given function.
 * @param callback
 * @param delay
 * @returns
 */
export function debounce(callback: (...args: any[]) => void, delay: number) {
	let timer: ReturnType<typeof setTimeout> | null = null;

	return (...args: any[]) => {
		if (timer) {
			clearTimeout(timer);
		}

		timer = setTimeout(() => {
			callback(...args);
		}, delay);
	};
}
