import { Zone } from "@prisma/client";

export const zones: Zone[] = [
  { id: 1, name: 'r&d_zone', locationId: 1, userId: 22 }, 
  { id: 2, name: 'assembly_line_zone', locationId: 1, userId: 4 }, 
  { id: 3, name: 'raw_materials_storage_zone', locationId: 1, userId: 5 }, 
  { id: 4, name: 'quality_control_zone', locationId: 1, userId: 6 }, 
  { id: 5, name: 'it_zone', locationId: 1, userId: 7 }, 
  { id: 6, name: 'customer_service_zone', locationId: 1, userId: 8 }, 
  { id: 7, name: 'prototype_zone', locationId: 1, userId: 9 }, 
  { id: 8, name: 'manager_office', locationId: 1, userId: 10 },
  { id: 9, name: 'water_supply', locationId: 1, userId: 11 }, 
  { id: 10, name: 'maintenance_zone', locationId: 1, userId: 12 }, 
  { id: 11, name: 'warehouse', locationId: 1, userId: 13 }, 
  { id: 12, name: 'storage_zone', locationId: 1, userId: 14 }, 
  { id: 13, name: 'server_room', locationId: 1, userId: 15 }, 
  { id: 14, name: 'electrical_zone', locationId: 1, userId: 16 }, 
  { id: 15, name: 'engineering_zone', locationId: 1, userId: 17 }, 
  { id: 16, name: 'training_simulation_zone', locationId: 1, userId: 18 },
  { id: 17, name: 'workstation_a', locationId: 1, userId: 19 }, 
  { id: 18, name: 'workstation_b', locationId: 1, userId: 20 },
  { id: 19, name: 'testing_lab', locationId: 1, userId: 21 }, 
];
