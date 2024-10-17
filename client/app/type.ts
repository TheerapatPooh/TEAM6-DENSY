

export type patrolStatus = "pending" | "scheduled" | "on_going" | "completed"
export type Role = "admin" | "inspector" | "supervisor"
export type DefectStatus = "reported" | "completed" | "pending_review" | "in_progress" | "resolved";
export type ItemType = "safety" | "environment" | 'maintenance';
export interface Zone {
    id: number;
    name: string;
    supervisor: User;
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
    inspector: Inspector;
    item: Item[];
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
    zoneId: number;
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
    name: string;
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

export interface DefectData {
    title: string;
    note: string;
    type: string;
    status: string;
    userId: number;
}

// filter 

export interface FilterPatrol {
    presetTitle: string | null;
    patrolStatus: string[];
    dateRange: { start: Date | undefined; end: Date | undefined };
}