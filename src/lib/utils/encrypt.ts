import { env } from '$env/dynamic/private';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const keyHex =
	env.UM_SERVER_ENCRYPTION_KEY ||
	'0000000000000000000000000000000000000000000000000000000000000000';

if (!env.UM_SERVER_ENCRYPTION_KEY) {
	console.warn(
		'Warning: UM_SERVER_ENCRYPTION_KEY is not set. Using a dummy key. This should NOT be used in production.'
	);
}

// Validate key length - AES-256 requires 32 bytes (64 hex characters)
if (keyHex.length !== 64) {
	throw new Error(`Invalid key length: expected 64 hex characters, got ${keyHex.length}`);
}

const SECRET_KEY = Buffer.from(keyHex, 'hex');

// Validate that the buffer is exactly 32 bytes
if (SECRET_KEY.length !== 32) {
	throw new Error(`Invalid key buffer length: expected 32 bytes, got ${SECRET_KEY.length}`);
}

export function encrypt(text: string): string {
	// Generate a new IV for each encryption (security best practice)
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(data: string): string {
	try {
		const parts = data.split(':');
		if (parts.length !== 2) {
			throw new Error('Invalid encrypted data format');
		}
		
		const iv = Buffer.from(parts[0], 'hex');
		const encryptedData = parts[1];

		if (iv.length !== 16) {
			throw new Error('Invalid IV length');
		}

		const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
		let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
		decrypted += decipher.final('utf-8');
		return decrypted;
	} catch (error) {
		throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}
