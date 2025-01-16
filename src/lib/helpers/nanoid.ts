import { customAlphabet } from 'nanoid';

const STANDARD_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const RECORD_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// Create a standard nanoid
export const createId = () => {
	const nanoid = customAlphabet(RECORD_ALPHABET, 16);

	return nanoid();
};

// Create a short nanoid, this is useful when generating
// a slug or a short id for a record
export const createShortId = () => {
	const nanoid = customAlphabet(RECORD_ALPHABET, 8);

	return nanoid();
};
