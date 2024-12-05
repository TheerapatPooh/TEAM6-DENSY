import { Patrol } from "@prisma/client";

export const patrols: Patrol[] = [
    { id: 1, date: new Date('2024-10-10 00:00:00.000'), startTime: null, endTime: null, duration: null, status: 'pending', presetId: 1 },
    { id: 2, date: new Date('2024-10-10 00:00:00.000'), startTime: null, endTime: null, duration: null, status: 'pending', presetId: 2 },
];
