import { PrismaClient } from '@prisma/client';

import { users } from './data/users';
import { checklists } from './data/checklists';
import { item_zones } from './data/item-zones';
import { items } from './data/items';
import { locations } from './data/locations';
import { patrol_checklists } from './data/patrol-checklists';
import { patrols } from './data/patrols';
import { preset_checklists } from './data/preset-checklist';
import { presets } from './data/presets';
import { profiles } from './data/profiles';
import { zones } from './data/zones';
import { images } from './data/images';


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
