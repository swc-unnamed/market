import { defineConfig } from 'drizzle-kit';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema/index.ts',
	out: './src/lib/server/db/migrations',
	dbCredentials: {
		url: process.env.DATABASE_URL ?? ''
	},
	verbose: true,
	strict: true,
	migrations: {
		prefix: 'timestamp',
		table: '__migrations__',
		schema: 'public'
	},
	dialect: 'postgresql'
});
