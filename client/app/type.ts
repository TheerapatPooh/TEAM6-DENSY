import { z } from "zod"
import { timeStamp } from 'console';
import { useTranslations } from "next-intl";

export type patrolStatus = "pending" | "scheduled" | "on_going" | "completed"
export type role = "admin" | "inspector" | "supervisor"
export type defectStatus = "reported" | "completed" | "pending_inspection" | "in_progress" | "resolved";
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
    active?: boolean;

    presets?: IPreset[];
    checklists?: IChecklist[]
    comments?: IComment[]
    profile: IProfile;
    notifications?: INotification[]
    defects?: IDefect[]
    zone?: IZone;
    patrolChecklists?: IPatrolChecklist[]
    images?: IImage[]
}

export interface IDefect {
    title: string;
    id: number;
    name: string;
    description: string;
    type: itemType;
    status: defectStatus;
    startTime: string;
    endTime: string;
    userId?: number;
    patrolResultId?: number;
    timeStamp: Date;
    user?: IUser;
    patrolResult: IPatrolResult;
    images: IDefectIImage[];
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
    startTime: string | null;
    endTime: string | null;
    duration: string | null;
    status: patrolStatus;
    presetId: number;

    patrolChecklists: IPatrolChecklist[];
    preset: IPreset;
    results: IPatrolResult[];
    itemCounts: number;
    inspectors?: IUser[]
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
    updatedBy: number;

    user?: IUser;
    presetChecklists?: IPresetChecklist[];
    patrols?: IPatrol[];
    zones?: IZone[];
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
    
    patrols?: IPatrolChecklist[];
    user: IUser;
    presetChecklists?: IPresetChecklist[];
    items: IItem[];
}

export interface IPatrolResult {
    inspectorId: number
    id?: number;
    status: boolean;
    itemId: number;
    zoneId: number;
    patrolId?: number;

    comments?: IComment[];
    defects?: IDefect[]
    itemZone?: IItemZone;
    patrol?: IPatrol;
}

export interface IItem {
    id: number;
    name: string;
    type: string;
    checklistId: number;

    itemZones: IItemZone[];
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

    results?: IPatrolResult;
    item: IItem;
    zone: IZone;
}

export interface ILocation {
    id: number
    name: string

    zones: IZone[]
}

export interface IComment {
    id: number;
    message: string;
    timestamp: string;
    status: boolean;
    userId: number;
    patrolResultId: number;

    user: IUser;
    patrolResult: IPatrolResult;
}


export interface IImage {
    id: number;
    path: string;
    timestamp?: string;
    updateBy?: number;

    user?: IUser;
    profiles: IProfile[];
    defects: IDefectIImage[];
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

export interface FilterDefect {
    defectStatus: string | null;
    defectType: string[];
    dateRange: { start: Date | undefined; end: Date | undefined };
}
export interface FilterComment {
    commentStatus: string | null;
    dateRange: { start: Date | undefined; end: Date | undefined };
}


export const LoginSchema = z.object({
    username: z.string().min(1, { message: "LoginUsernameRequire" }),
    password: z.string().min(1, { message: "LoginPasswordRequire" }),
    rememberMe: z.boolean().optional()
})