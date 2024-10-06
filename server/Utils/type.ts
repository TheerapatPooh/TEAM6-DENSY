import { Role } from "@prisma/client";

export interface Profile {
    id: number;
    name?: string;
    age?: number;
    tel?: string;
    address?: string;
    image?: Image | null;
    userId: number;
}

export interface User {
    id: number;
    username?: string;
    email?: string | null;
    password?: any;
    role: Role;
    department?: string | null;
    createdAt?: string;
    profile?: Profile[];
}

export interface Image {
    id: number;
    path: string;
    profileId: number;
}

export interface Patrol {
    id: number;
    date: Date;
    startTime?: Date | null;
    endTime?: Date | null;
    duration?: string | null;
    status: string;
    preset: Preset;
    checklist: PatrolChecklist[];
    result?: PatrolResult[];
}

export interface Preset {
    id: number;
    title: string;
    description: string;
    version: number;
}

export interface PatrolChecklist {
    id: number;
    checklistId: number;
    inspector: User; 
    checklist: Checklist;
}


export interface PatrolResult {
    id: number;
    status: boolean;      
    itemId: number;       
    defectId: number | null;
}

export interface Checklist {
    id: number;
    title: string;
    version: number;
    item: Item[];
}

export interface Item {
    id: number;
    name: string;
    type: string;
    zones: Zone[];
}

export interface Zone {
    id: number;
    name: string;
}