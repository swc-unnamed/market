import fs from 'fs';
import { config } from 'dotenv';
import csvParser from 'csv-parser';
import { assets } from '../schema';
import type { InferInsertModel } from 'drizzle-orm';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../schema';

async function seed() {
	config();

	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

	if (!process.env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');

	const client = createClient({
		url: process.env.DATABASE_URL,
		authToken: process.env.DATABASE_AUTH_TOKEN
	});
	const db = drizzle(client, { schema: schema });

	const result: InferInsertModel<typeof assets>[] = [];

	fs.createReadStream('./src/lib/server/db/seed/data.csv')
		.pipe(csvParser())
		.on('data', (data) => {
			result.push(data);
		})
		.on('error', (err) => {
			console.log(err);
		})
		.on('end', async () => {
			console.log(`Loading ${result.length} records into the database`);
			try {
				await db.insert(assets).values(result);

				console.log('Data loaded successfully');

				process.exit(0);
			} catch (error) {
				console.log(error);
			}
		});
}

seed();
