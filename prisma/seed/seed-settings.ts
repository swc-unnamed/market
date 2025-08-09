import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../../src/lib/database/prisma/client';
import type { UserSettings } from '../../src/lib/models/common/user-settings';

async function seedSettings() {
  const adapter = new PrismaPg({ connectionString: process.env.UM_DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.user.findMany()

  const defaultSettings: UserSettings = {
    listingViewStyle: "card"
  }

  for (const user of users) {
    await prisma.userSetting.upsert({
      where: {
        userId: user.id
      },
      create: {
        userId: user.id,
        settings: JSON.parse(JSON.stringify(defaultSettings))
      },
      update: {}
    })
  }
}

seedSettings();