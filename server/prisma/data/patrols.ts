import { Patrol } from "@prisma/client";

export const patrols: Patrol[] = [
    { pt_id: 1, pt_date: new Date('2024-10-10 00:00:00.000'), pt_start_time: null, pt_end_time: null, pt_duration: null, pt_status: 'pending', pt_ps_id: 1 },
    { pt_id: 2, pt_date: new Date('2024-10-10 00:00:00.000'), pt_start_time: null, pt_end_time: null, pt_duration: null, pt_status: 'pending', pt_ps_id: 2 },
];
