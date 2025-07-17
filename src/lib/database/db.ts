import { PrismaClient } from './prisma/client'
import { env } from '$env/dynamic/private';
import { PrismaPg } from '@prisma/adapter-pg';

let prisma: PrismaClient | undefined = undefined;

function getPrismaClient() {
  if (!prisma) {
    const adapter = new PrismaPg({ connectionString: env.UM_DATABASE_URL });

    prisma = new PrismaClient({ adapter });
  }

  return prisma;
}

export * from './prisma/client';
export const db = getPrismaClient();