import { Zone } from "@prisma/client";

export const zones: Zone[] = [
  { ze_id: 2, ze_name: 'Production Zone', ze_lt_id: 1, ze_us_id: 7 },
  { ze_id: 3, ze_name: 'Warehouse Zone', ze_lt_id: 1, ze_us_id: 6 },
  { ze_id: 4, ze_name: 'Main Entrance', ze_lt_id: 1, ze_us_id: 5 },
  { ze_id: 5, ze_name: 'Server Room', ze_lt_id: 1, ze_us_id: 4 },
  { ze_id: 6, ze_name: 'Lobby', ze_lt_id: 1, ze_us_id: 3 },
];
