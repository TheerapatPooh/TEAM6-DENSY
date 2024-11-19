import { Zone } from "@prisma/client";

export const zones: Zone[] = [
  { ze_id: 1, ze_name: 'r&d_zone', ze_lt_id: 1, ze_us_id: 3 }, 
  { ze_id: 2, ze_name: 'assembly_line_zone', ze_lt_id: 1, ze_us_id: 4 }, 
  { ze_id: 3, ze_name: 'raw_materials_storage_zone', ze_lt_id: 1, ze_us_id: 5 }, 
  { ze_id: 4, ze_name: 'quality_control_zone', ze_lt_id: 1, ze_us_id: 6 }, 
  { ze_id: 5, ze_name: 'it_zone', ze_lt_id: 1, ze_us_id: 7 }, 
  { ze_id: 6, ze_name: 'customer_service_zone', ze_lt_id: 1, ze_us_id: 8 }, 
  { ze_id: 7, ze_name: 'prototype_zone', ze_lt_id: 1, ze_us_id: 9 }, 
  { ze_id: 8, ze_name: 'manager_office', ze_lt_id: 1, ze_us_id: 10 },
  { ze_id: 9, ze_name: 'water_supply', ze_lt_id: 1, ze_us_id: 11 }, 
  { ze_id: 10, ze_name: 'maintenance_zone', ze_lt_id: 1, ze_us_id: 12 }, 
  { ze_id: 11, ze_name: 'warehouse', ze_lt_id: 1, ze_us_id: 13 }, 
  { ze_id: 12, ze_name: 'storage_zone', ze_lt_id: 1, ze_us_id: 14 }, 
  { ze_id: 13, ze_name: 'server_room', ze_lt_id: 1, ze_us_id: 15 }, 
  { ze_id: 14, ze_name: 'electrical_zone', ze_lt_id: 1, ze_us_id: 16 }, 
  { ze_id: 15, ze_name: 'engineering_zone', ze_lt_id: 1, ze_us_id: 17 }, 
  { ze_id: 16, ze_name: 'training_simulation_zone', ze_lt_id: 1, ze_us_id: 18 },
  { ze_id: 17, ze_name: 'workstation_a', ze_lt_id: 1, ze_us_id: 19 }, 
  { ze_id: 18, ze_name: 'workstation_b', ze_lt_id: 1, ze_us_id: 20 },
  { ze_id: 19, ze_name: 'testing_lab', ze_lt_id: 1, ze_us_id: 21 }, 
];
