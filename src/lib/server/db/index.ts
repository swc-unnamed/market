import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL_OLD) {
	console.error('DATABASE_URL is not set');
}

export const db = drizzle(process.env.DATABASE_URL_OLD!, { schema: schema, logger: false });
