import { PrismaClient } from '@prisma/client';

import { users } from './data/users';
import { checklists } from './data/checklists';
import { item_zones } from './data/item_zones';
import { items } from './data/items';
import { locations } from './data/locations';
import { patrol_checklists } from './data/patrol_checklists';
import { patrols } from './data/patrols';
import { preset_checklists } from './data/preset_checklist';
import { presets } from './data/presets';
import { profiles } from './data/profiles';
import { zones } from './data/zones';
import { images } from './data/images';

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
