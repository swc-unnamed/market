import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
	console.error('DATABASE_URL is not set');
}

export const db = drizzle(process.env.DATABASE_URL!, { schema: schema, logger: false });
