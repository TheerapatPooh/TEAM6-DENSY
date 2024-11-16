import { PrismaClient } from '@prisma/client';

import { users } from './data/users.js';
import { checklists } from './data/checklists.js';
import { item_zones } from './data/item-zones.js';
import { items } from './data/items.js';
import { locations } from './data/locations.js';
import { patrol_checklists } from './data/patrol-checklists.js';
import { patrols } from './data/patrols.js';
import { preset_checklists } from './data/preset-checklist.js';
import { presets } from './data/presets.js';
import { profiles } from './data/profiles.js';
import { zones } from './data/zones.js';
import { images } from './data/images.js';


const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const locationsCount = await prisma.location.count();

  if (locationsCount === 0) {
    await prisma.location.createMany({ data: locations });
    await prisma.user.createMany({ data: users });
    await prisma.image.createMany({ data: images });
    await prisma.profile.createMany({ data: profiles });
    await prisma.zone.createMany({ data: zones });
    await prisma.checklist.createMany({ data: checklists });
    await prisma.item.createMany({ data: items });
    await prisma.itemZone.createMany({ data: item_zones });
    await prisma.preset.createMany({ data: presets });
    await prisma.presetChecklist.createMany({ data: preset_checklists });
    await prisma.patrol.createMany({ data: patrols });
    await prisma.patrolChecklist.createMany({ data: patrol_checklists });

    console.log('Seeding finished.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
