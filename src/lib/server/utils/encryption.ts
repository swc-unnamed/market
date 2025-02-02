import { env } from '$env/dynamic/private';
import * as crypto from 'crypto';

/**
 * Manage encryption and decryption of data
 */
export class Encryption {
	ALGORITHM = 'aes-256-cbc';
	SECRET_KEY = Buffer.from(env.UM_ENCRYPTION_KEY, 'hex');
	IV = crypto.randomBytes(16);

	constructor() {}

	/**
	 * Encrypt data
	 * @param data {string} - Data to encrypt
	 * @returns
	 */
	encrypt(data: string): string {
		const cipher = crypto.createCipheriv(this.ALGORITHM, this.SECRET_KEY, this.IV);

		let encrypted = cipher.update(data, 'utf-8', 'hex');
		encrypted += cipher.final('hex');

		return this.IV.toString('hex') + ':' + encrypted;
	}

	/**
	 *
	 * @param data {string} - Data to decrypt
	 * @returns
	 */
	descrypt(data: string): string {
		const parts = data.split(':');
		const iv = Buffer.from(parts.shift()!, 'hex');
		const encryptedData = parts.join(':');

		const decipher = crypto.createDecipheriv(this.ALGORITHM, this.SECRET_KEY, iv);
		let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
		decrypted += decipher.final('utf-8');
		return decrypted;
	}
}
