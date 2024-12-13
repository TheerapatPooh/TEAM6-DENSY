import { Item } from "@prisma/client";

export const items: Item[] = [
    { id: 2, name: 'Fire Extinguisher Check', type: 'safety', checklistId: 1 },
    { id: 3, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 1 },
    { id: 4, name: 'First Aid Kit Check', type: 'safety', checklistId: 1 },
    { id: 5, name: 'Electrical Panel Inspection', type: 'maintenance', checklistId: 2 },
    { id: 6, name: 'Air Conditioning System Check', type: 'maintenance', checklistId: 2 },
    { id: 7, name: 'Lighting System Check', type: 'maintenance', checklistId: 2 },
    { id: 8, name: 'Floor Cleanliness Check', type: 'environment', checklistId: 3 },
    { id: 9, name: 'Trash Disposal Check', type: 'environment', checklistId: 3 },
    { id: 10, name: 'CCTV Functionality Check', type: 'safety', checklistId: 4 },
    { id: 11, name: 'Access Control System Check', type: 'safety', checklistId: 4 },
    { id: 12, name: 'Server Equipment Inspection', type: 'maintenance', checklistId: 5 },
    { id: 13, name: 'Forklift Maintenance', type: 'maintenance', checklistId: 5 },
];
