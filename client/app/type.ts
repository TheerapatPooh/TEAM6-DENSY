import { z } from "zod"

export type patrolStatus = "pending" | "scheduled" | "on_going" | "completed"
export type role = "admin" | "inspector" | "supervisor"
export type defectStatus = "reported" | "completed" | "pending_review" | "in_progress" | "resolved";
export type itemType = "safety" | "environment" | 'maintenance';
export type notificationType = "information" | "request" | 'system';

export interface IUser {
    id: number;
    username?: string;
    email?: string;
    password?: any;
    role: role;
    department?: string | null;
    createdAt?: string;

    updatePreset?: IPreset[];
    updateChecklist?: IChecklist[]
    comment?: IComment[]
    profile: IProfile;
    notification?: INotification[]
    defect?: IDefect[]
    zone?: IZone;
    checklist?: IPatrolChecklist[]
    image?: IImage[]
}

export interface IDefect {
    id: number;
    name: string;
    description: string;
    type: itemType;
    status: defectStatus;
    timestamp: string;
    userId?: number;
    patrolId?: number;

    user?: IUser;
    patrolResult: IPatrolResult;
    image: IDefectIImage[];
}

export interface INotification {
    id: number
    message: string
    read: boolean,
    timestamp: string
    type: notificationType
    url?: string
    userId: number

    user?: IUser
}

export interface IProfile {
    id: number;
    name: string;
    age?: number;
    tel?: string;
    address?: string;
    userId: number
    imageId: number | null

    image?: IImage | null;
    user?: IUser;
}


export interface IPatrol {
    id: number;
    date: string;
    startTime?: string | null;
    endTime?: string | null;
    duration?: string | null;
    status: patrolStatus;
    presetId?: number

    patrolChecklist: IPatrolChecklist[];
    preset: IPreset;
    result: IPatrolResult[];
}

export interface IPatrolChecklist {
    id?: number;
    patrolId?: number;
    checklistId: number;
    userId: number;

    patrol?: IPatrol;
    checklist?: IChecklist;
    inspector?: IUser;
}

export interface IPreset {
    id: number;
    title: string;
    description: string;
    version: number;
    latest: boolean;
    updatedAt: string;
    updateBy: number;

    user?: IUser;
    presetChecklist?: IPresetChecklist[];
    patrol?: IPatrol[];
}

export interface IPresetChecklist {
    presetId: number;
    checklistId: number;
    
    checklist: IChecklist;
    preset: IPreset;
}

export interface IChecklist {
    id: number;
    title: string;
    version: number;
    latest: boolean;
    updatedAt: string;
    updatedBy: number;

    patrol?: IPatrolChecklist[];
    user: IUser;
    presetChecklist?: IPresetChecklist;
    item: IItem[];
}

export interface IPatrolResult {
    inspectorId: number
    id?: number;
    status: boolean;
    itemId: number;
    zoneId: number;
    patrolId?: number;

    comment?: IComment;
    defects?: IDefect[]
    itemIZone?: IItemZone;
    patrol?: IPatrol;
}

export interface IItem {
    id: number;
    name: string;
    type: string;
    checklistId: number;

    itemZone: IItemZone[];
    checklist?: IChecklist
}

export interface IZone {
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
    supervisor?: IUser;
}


export interface IItemZone {
    itemId: number;
    zoneId: number;
    zone: IZone;
    item: IItem;
    result?: IPatrolResult;
}

export interface ILocation {
    id: number
    name: string

    zone: IZone[]
}

export interface IComment {
    id: number;
    message: string;
    timestamp: string;
    userId: number;
    patrolResultId: number;

    user: IUser;
    patrolResult: IPatrolResult;
}


export interface IImage {
    id: number;
    path: string;
    timestamp?: string;
    updateBy? :number;

    user?: IUser;
    profiles: IProfile[];
    defect: IDefectIImage[];
}

export interface IDefectIImage {
    defectId?: number
    imageId?: number
    image: IImage
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