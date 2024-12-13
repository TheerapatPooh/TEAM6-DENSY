import { PatrolChecklist } from "@prisma/client";

export const patrol_checklists: PatrolChecklist[] = [
    { id: 1, patrolId: 1, checklistId: 3, userId: 2 },
    { id: 2, patrolId: 1, checklistId: 4, userId: 8 },
    { id: 3, patrolId: 2, checklistId: 2, userId: 8 },
    { id: 4, patrolId: 2, checklistId: 5, userId: 8 },
];
