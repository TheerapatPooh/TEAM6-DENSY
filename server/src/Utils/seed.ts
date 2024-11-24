import { PrismaClient } from '@prisma/client';

import { users } from '@Utils/data/users.js';
import { checklists } from '@Utils/data/checklists.js';
import { item_zones } from '@Utils/data/item-zones.js';
import { items } from '@Utils/data/items.js';
import { locations } from '@Utils/data/locations.js';
import { patrol_checklists } from '@Utils/data/patrol-checklists.js';
import { patrols } from '@Utils/data/patrols.js';
import { preset_checklists } from '@Utils/data/preset-checklist.js';
import { presets } from '@Utils/data/presets.js';
import { profiles } from '@Utils/data/profiles.js';
import { zones } from '@Utils/data/zones.js';
import { images } from '@Utils/data/images.js';


const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const totalSteps = 12; // จำนวนขั้นตอนทั้งหมดที่เราต้องทำ
  let currentStep = 0; // ขั้นตอนปัจจุบัน

  const logProgress = () => {
    currentStep += 1;
    const percent = Math.round((currentStep / totalSteps) * 100);
    console.log(`Progress: ${percent}% (${currentStep}/${totalSteps})`);
  };
  await prisma.location.createMany({ data: locations });
  logProgress();
  await prisma.user.createMany({ data: users });
  logProgress();
  await prisma.image.createMany({ data: images });
  logProgress();
  await prisma.profile.createMany({ data: profiles });
  logProgress();
  await prisma.zone.createMany({ data: zones });
  logProgress();
  await prisma.checklist.createMany({ data: checklists });
  logProgress();
  await prisma.item.createMany({ data: items });
  logProgress();
  await prisma.itemZone.createMany({ data: item_zones });
  logProgress();
  await prisma.preset.createMany({ data: presets });
  logProgress();
  await prisma.presetChecklist.createMany({ data: preset_checklists });
  logProgress();
  await prisma.patrol.createMany({ data: patrols });
  logProgress();
  await prisma.patrolChecklist.createMany({ data: patrol_checklists });
  logProgress();

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
