

export type patrolStatus ="Pending"|"Scheduled"| "OnGoing"|"Completed"
export type Role = "ADMIN"|"INSPECTOR"|"RESPONSIBLEMAN"|"OFFICER"
export type DefectStatus = "Reported" | "Completed" | "PendingReview" | "InProgress" | "Resolved";
export type DefectType = "Safety" | "Environmental";
export interface Zone {
    id: number;
    name: string;
}

export interface Item {
    id: number;
    name: string;
    type: string;
    zone: Zone[];
}

export interface Inspector {
    id: number;
    name: string;
    age: number | null;
    tel: string | null;
    address: string | null;
    imagePath: string | null;
}

export interface Checklist {
    id: number;
    title: string;
    version: number;
    latest: boolean;
    updatedAt: string;
    updateBy: Inspector;
    items: Item[];
}

export interface Preset {
    id: number;
    title: string;
    description: string;
    version: number;
    latest: boolean;
    updatedAt: string;
    updateBy: Inspector; 
    checklist: Checklist[]; 
}

export interface PatrolResult {
    id: number;
    status: boolean;
    itemId: number;
    defectId: number | null;
}

export interface Patrol {
    id: number;
    date: string;
    startTime?: string | null;
    endTime?: string | null;
    duration?: string | null;
    status: string;
    preset: Preset; 
    checklist: Checklist[];
    result: PatrolResult[];
}

export interface Profile {
    id: number;
    name: string;
    age?: number;
    tel?: string;
    address?: string;
    image?: Image | null;
    userId: number;
}

export interface User {
    createdAt?: string;
    department?: string | null;
    email?: string;
    id: number;
    profile: Profile;
    role: Role;
    username?: string;
    password?: any;
}


export interface Image {
    id: number;
    path: string;
}

export interface PatrolChecklist {
    checklistId: number;
    inspectorId: number;
}