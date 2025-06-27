import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import combineData from './combine_entities.json' with { type: 'json' };

type CombineDataImport = {
	combine_entities: any[];
};

async function seed() {
	const adapter = new PrismaPg({ connectionString: process.env.UM_DATABASE_URL });
	const prisma = new PrismaClient({ adapter });

	const data = combineData as CombineDataImport;
	const failedEntities: any[] = [];

	console.log(`Total entities to seed: ${data.combine_entities.length}`);

	for (const entity of data.combine_entities) {
		try {
			const record = await prisma.entity.upsert({
				where: {
					combineUid: entity.combine_uid,
				},
				create: {
					name: entity.name,
					type: entity.type,
					combineUid: entity.combine_uid,
					combineHref: entity.combine_href,
					combineData: entity.combine_data,
					imageLarge: entity.image_large,
					imageSmall: entity.image_small
				},
				update: {
					name: entity.name,
					type: entity.type,
					combineHref: entity.combine_href,
					combineData: entity.combine_data,
					imageLarge: entity.image_large,
					imageSmall: entity.image_small
				}
			});

			console.log(`Seeded: ${record.name} with combine_uid ${record.combineUid}`);
		} catch (error) {
			console.error(`Failed to seed entity with combine_uid ${entity.combine_uid}:`, error);
			failedEntities.push(entity);
		}
	}

	if (failedEntities.length > 0) {
		console.error(`Failed to seed ${failedEntities.length} entities.`);
	} else {
		console.log('All entities seeded successfully.');
	}

	await prisma.$disconnect();
}

seed();