import { z } from "zod"
import { timeStamp } from 'console';
import { useTranslations } from "next-intl";
import { badgeVariants } from "@/components/badge-custom";

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
    resetToken?: string;

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
    supervisorId?: number;
    patrolResultId?: number;
    timeStamp: Date;

    user?: IUser;
    zone?: IZone;
    supervisor?: IUser;
    patrolResult: IPatrolResult;
    images: IDefectImage[];
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
    disabled?: boolean;
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
    versionCount?: number;
    disabled?: boolean;
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
    id: number;
    status: boolean;
    itemId: number;
    zoneId: number;
    patrolId?: number;
    supervisorId?: number;

    comments?: IComment[];
    defects?: IDefect[]
    itemZone?: IItemZone;
    patrol?: IPatrol;
    supervisor?: IUser;
}

export interface IItem {
    id: number;
    name: string;
    type: itemType;
    checklistId: number;

    itemZones: IItemZone[];
    checklist?: IChecklist
}

export interface IZone {
    id: number;
    name: string;
    locationId?: number;
    userId?: number;
    pathData?: string;
    text?: {
        x: number;
        y: number;
        fontSize: number;
        rotation: number;
    } | null
    supervisor?: IUser;
    defects?: number;
    dashboard?: {
        defectReported: IDashboardCard;
        defectCompleted: IDashboardCard;
        defectPending: IDashboardCard;
        chartData: IZoneChartDataItem[];
        defectTrend: number;
        defects?: IDefect[];
    }
}

interface IZoneChartDataItem {
    month: string;
    defect: number;
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
    supervisorId: number;
    patrolResultId: number;

    user: IUser;
    supervisor: IUser;
    patrolResult: IPatrolResult;
}


export interface IImage {
    id: number;
    path: string;
    timestamp?: string;
    updateBy?: number;

    user?: IUser;
    profiles: IProfile[];
    defects: IDefectImage[];
}

export interface IDefectImage {
    defectId?: number
    imageId?: number
    image: IImage
}

















// filter 

export interface IFilterPatrol {
    presetTitle: string | null;
    patrolStatuses: string[];
    dateRange: { start: Date | undefined; end: Date | undefined };
}

export interface IFilterDefect {
    defectStatus: string | null;
    defectTypes: string[];
    dateRange: { start: Date | undefined; end: Date | undefined };
}
export interface IFilterComment {
    commentStatus: string | null;
    dateRange: { start: Date | undefined; end: Date | undefined };
}


export const LoginSchema = z.object({
    username: z.string().min(1, { message: "LoginUsernameRequire" }),
    password: z.string().min(1, { message: "LoginPasswordRequire" }),
    rememberMe: z.boolean().optional()
})

export interface IToast {
    variant: "default" | "error" | "success";
    title: string;
    description: string;
}


export interface IHeatmapZone {
    id: number;
    name: string;
    defects: number;
}

export interface IHeatMap {
    data: IHeatmapZone[];
}

export interface IDefectCategory {
    chartData: IDefectCategoryItem[];
    trend: number;
}
export interface IDefectCategoryItem {
    type: string;
    amounts: number;
    fill: string;
}

export interface ICommonDefectItem {
    name: string;
    amounts: number;
    fill: string;
}
export interface IPatrolCompletionRate {
    chartData: IPatrolCompletionRateItem[];
    trend: number;
    percent: number;
}
export interface IPatrolCompletionRateItem {
    noDefect: number;
    withDefect: number;
}
export interface IDashboardCard {
    title: string;
    value: number;
    trend?: number;
    icon: string;
    variant: keyof typeof badgeVariants;
    positive?: boolean;
}

export interface IPatrolDuration {
    duration: number;
}


