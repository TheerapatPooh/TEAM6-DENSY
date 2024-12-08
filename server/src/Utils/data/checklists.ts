import { Checklist } from "@prisma/client"

export const checklists: Checklist[] = [
    { id: 1, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },
    { id: 2, title: 'Maintenance Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:10.000'), updatedBy: 1 },
    { id: 3, title: 'Cleanliness Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:15.000'), updatedBy: 1 },
    { id: 4, title: 'Security Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:25.000'), updatedBy: 1 },
    { id: 5, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
];
