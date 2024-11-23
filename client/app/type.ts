import { z } from "zod"

export type patrolStatus = "pending" | "scheduled" | "on_going" | "completed"
export type Role = "admin" | "inspector" | "supervisor"
export type DefectStatus = "reported" | "completed" | "pending_review" | "in_progress" | "resolved";
export type ItemType = "safety" | "environment" | 'maintenance';
export type NotificationType = "information" | "request" | 'system';

export interface Location {
    id: number
    name: string
    zone: Zone[]
}

export interface Zone {
    id: number;
    name: string;
    locationId: number;
    userId: number;
    pathData?: string;
    text?: {
        x: number;
        y: number;
        fontSize: number;
        rotation: number;
    } | null
    supervisor?: User;
}

export interface Item {
    id: number;
    name: string;
    type: string;
    checklistId: number;
    itemZone: ItemZone[];
}

export interface ItemZone {
    zone: Zone;
    item: Item;
}



export interface Checklist {
    id: number;
    title: string;
    version: number;
    latest: boolean;
    updatedAt: string;
    updatedBy: number;
    user: User;
    item: Item[];
}

export interface Preset {
    id: number;
    title: string;
    description: string;
    version: number;
    latest: boolean;
    updatedAt: string;
    updateBy: number;
    checklist?: PresetChecklist[];
}

export interface PresetChecklist {
    presetId: number;
    checklistId: number;
    checklist: Checklist;
}

export interface PatrolResult {
    inspectorId:number
    id?: number;
    status: boolean;
    itemId: number;
    zoneId: number;
    patrolId?: number
    defectId?: number | null;
    defects?: Defect[]
}

export interface PatrolChecklistType {
    id?: number;
    patrolId?: number;
    checklistId: number;
    checklist?: Checklist;
    userId: number;
    inspector?: User;
}


export interface Patrol {
    id: number;
    date: string;
    startTime?: string | null;
    endTime?: string | null;
    duration?: string | null;
    status: patrolStatus;
    presetId?: number
    preset: Preset;
    patrolChecklist: PatrolChecklistType[];
    result: PatrolResult[];
}

export interface Profile {
    id: number;
    name: string;
    age?: number;
    tel?: string;
    address?: string;
    userId: number
    imageId: number | null
    image?: Image | null;
}

export interface User {
    id: number;
    username?: string;
    password?: any;
    email?: string;
    role: Role;
    department?: string | null;
    createdAt?: string;
    profile: Profile;
}


export interface Image {
    id: number;
    path: string;
    timestamp?: string;
    user?: User;
}

export interface Defect {
    id: number;
    name: string;
    description: string;
    type: ItemType;
    status: DefectStatus;
    timestamp: string;
    userId?: number;
    patrolId?:number
    patrolResult: PatrolResult;
    image: DefectImage[];
  }

  export interface DefectImage {
    defectId?: number
    imageId?: number
    image: Image
  }

  export interface NotificationProps {
    nt_id: number
    nt_message: string
    nt_read: boolean,
    nt_timestamp: string
    nt_type: NotificationType
    nt_url?: string
    nt_us_id: number
  }

// filter 

export interface FilterPatrol {
    presetTitle: string | null;
    patrolStatus: string[];
    dateRange: { start: Date | undefined; end: Date | undefined };
}
  
export const LoginSchema = z.object({
    username: z.string(),
    password: z.string(),
    rememberMe: z.boolean().optional()
})