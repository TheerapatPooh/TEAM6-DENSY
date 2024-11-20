import { Checklist } from "@prisma/client"

export const checklists: Checklist[] = [
    { cl_id: 1, cl_title: 'Safety Inspection', cl_version: 1, cl_latest: true, cl_update_at: new Date('2024-10-06 17:05:09.000'), cl_update_by: 1 },
    { cl_id: 2, cl_title: 'Maintenance Inspection', cl_version: 1, cl_latest: true, cl_update_at: new Date('2024-10-06 17:05:10.000'), cl_update_by: 1 },
    { cl_id: 3, cl_title: 'Cleanliness Inspection', cl_version: 1, cl_latest: true, cl_update_at: new Date('2024-10-06 17:05:15.000'), cl_update_by: 1 },
    { cl_id: 4, cl_title: 'Security Inspection', cl_version: 1, cl_latest: true, cl_update_at: new Date('2024-10-06 17:05:25.000'), cl_update_by: 1 },
    { cl_id: 5, cl_title: 'Equipment Inspection', cl_version: 1, cl_latest: true, cl_update_at: new Date('2024-10-06 17:05:43.000'), cl_update_by: 1 },
];
