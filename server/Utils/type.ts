

export type patrolStatus ="Pending"|"Scheduled"| "OnGoing"|"Completed"

export type Role = "ADMIN"|"INSPECTOR"|"RESPONSIBLEMAN"|"OFFICER"
  

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
    inspector: Inspector;
    item: Item[]; 
}

export interface Preset {
    id: number;
    title: string;
    description: string;
    version: number;
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
    profile?: Profile;
}


export interface Image {
    id: number;
    path: string;
}
