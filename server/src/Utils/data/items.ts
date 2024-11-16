import { Item } from "@prisma/client";

export const items: Item[] = [
    { it_id: 2, it_name: 'Fire Extinguisher Check', it_type: 'safety', it_cl_id: 1 },
    { it_id: 3, it_name: 'Emergency Exit Sign Check', it_type: 'safety', it_cl_id: 1 },
    { it_id: 4, it_name: 'First Aid Kit Check', it_type: 'safety', it_cl_id: 1 },
    { it_id: 5, it_name: 'Electrical Panel Inspection', it_type: 'maintenance', it_cl_id: 2 },
    { it_id: 6, it_name: 'Air Conditioning System Check', it_type: 'maintenance', it_cl_id: 2 },
    { it_id: 7, it_name: 'Lighting System Check', it_type: 'maintenance', it_cl_id: 2 },
    { it_id: 8, it_name: 'Floor Cleanliness Check', it_type: 'environment', it_cl_id: 3 },
    { it_id: 9, it_name: 'Trash Disposal Check', it_type: 'environment', it_cl_id: 3 },
    { it_id: 10, it_name: 'CCTV Functionality Check', it_type: 'safety', it_cl_id: 4 },
    { it_id: 11, it_name: 'Access Control System Check', it_type: 'safety', it_cl_id: 4 },
    { it_id: 12, it_name: 'Server Equipment Inspection', it_type: 'maintenance', it_cl_id: 5 },
    { it_id: 13, it_name: 'Forklift Maintenance', it_type: 'maintenance', it_cl_id: 5 },
];
