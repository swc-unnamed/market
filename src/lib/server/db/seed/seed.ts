import fs from 'fs';
import { config } from 'dotenv';
import csvParser from 'csv-parser';
import { entities } from '../schema';
import type { InferInsertModel } from 'drizzle-orm';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';

async function seed() {
	config();

	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

	const db = drizzle(process.env.DATABASE_URL!, { schema: schema });

	const result: InferInsertModel<typeof entities>[] = [];

	console.log('🌱 Starting seed process');

	fs.createReadStream('./ksrc/lib/server/db/seed/data.csv')
		.pipe(csvParser())
		.on('data', (data) => {
			result.push(data);
		})
		.on('error', (err) => {
			console.log(err);
		})
		.on('end', async () => {
			console.log(`🌱 Loading ${result.length} records into the database`);
			try {
				await db.insert(entities).values(result);

				console.log('🌱 Data has been seeded successfully');
				process.exit(0);
			} catch (error) {
				console.log(error);
			}
		});
}

seed();
