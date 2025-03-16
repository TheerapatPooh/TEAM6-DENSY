import { z } from "zod"
import { badgeVariants } from "@/components/badge-custom";

// สถานะการตรวจตรา
export type patrolStatus = "pending" | "scheduled" | "on_going" | "completed"
// บทบาทของผู้ใช้
export type role = "admin" | "inspector" | "supervisor"
// สถานะข้อบกพร่อง
export type defectStatus = "reported" | "completed" | "pending_inspection" | "in_progress" | "resolved";
// ประเภทข้อบกพร่อง
export type itemType = "safety" | "environment" | 'maintenance';
// ประเภทข้อความแจ้งเตือน
export type notificationType = "information" | "request" | 'system';

// เก็บข้อมูลผู้ใช้ เช่น ชื่อผู้ใช้, อีเมล, บทบาท และรหัสผ่าน

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

// ข้อบกพร่องที่พบระหว่างการตรวจสอบ พร้อมสถานะและผู้รับผิดชอบ
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

// จัดเก็บข้อความแจ้งเตือนที่เกี่ยวข้องกับผู้ใช้
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

// เก็บข้อมูลส่วนตัวของผู้ใช้ เช่น ชื่อ, อายุ, ที่อยู่
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

// การตรวจตรา รวมถึงเวลาที่เริ่มและสิ้นสุด
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

// บันทึกการตรวจตราของแต่ละรายการในรอบการตรวจตรา
export interface IPatrolChecklist {
    id?: number;
    patrolId?: number;
    checklistId: number;
    userId: number;

    patrol?: IPatrol;
    checklist?: IChecklist;
    inspector?: IUser;
}

// รายการรูปแบบการตรวจตรา
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

// รายการตรวจตราของแต่ละรายการในรูปแบบการตรวจตรา
export interface IPresetChecklist {
    presetId: number;
    checklistId: number;

    checklist: IChecklist;
    preset: IPreset;
}

// รายการตรวจตรา
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

// บันทึกผลการตรวจตราของแต่ละรายการในรอบการตรวจตรา
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

// หัวข้อการตรวจตรา
export interface IItem {
    id: number;
    name: string;
    type: itemType;
    checklistId: number;

    itemZones: IItemZone[];
    checklist?: IChecklist
}

// พื้นที่ตรวจตรา
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

// ข้อมูลสำหรับแสดงกราฟของพื้นที่ตรวจตรา
interface IZoneChartDataItem {
    month: string;
    defect: number;
}

// รายการตรวจตราของแต่ละรายการในพื้นที่ตรวจตรา
export interface IItemZone {
    itemId: number;
    zoneId: number;

    results?: IPatrolResult;
    item: IItem;
    zone: IZone;
}

// สถานที่ตรวจตรา
export interface ILocation {
    id: number
    name: string

    zones: IZone[]
}

// รายการข้อเสนอแนะ
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

// รูปภาพ
export interface IImage {
    id: number;
    path: string;
    timestamp?: string;
    updateBy?: number;

    user?: IUser;
    profiles: IProfile[];
    defects: IDefectImage[];
}

// บันทึกรูปภาพของข้อบกพร่องที่พบระหว่างการตรวจสอบ
export interface IDefectImage {
    defectId?: number
    imageId?: number
    image: IImage
}




// filter 

// กรองข้อมูลการตรวจตรา
export interface IFilterPatrol {
    presetTitle: string | null;
    patrolStatuses: string[];
    dateRange: { start: Date | undefined; end: Date | undefined };
}

// กรองข้อมูลข้อบกพร่อง
export interface IFilterDefect {
    defectStatus: string | null;
    defectTypes: string[];
    dateRange: { start: Date | undefined; end: Date | undefined };
}

// กรองข้อมูลข้อความแจ้งเตือน
export interface IFilterComment {
    commentStatus: string | null;
    dateRange: { start: Date | undefined; end: Date | undefined };
}

export const LoginSchema = z.object({
    username: z.string().min(1, { message: "LoginUsernameRequire" }),
    password: z.string().min(1, { message: "LoginPasswordRequire" }),
    rememberMe: z.boolean().optional()
})

// แจ้งเตือน
export interface IToast {
    variant: "default" | "error" | "success";
    title: string;
    description: string;
}

// แผนที่ความร้อนข้อมูลข้อบกพร่องแต่ละพื้นที่
export interface IHeatmapZone {
    id: number;
    name: string;
    defects: number;
}

// แผนที่ความร้อน
export interface IHeatMap {
    data: IHeatmapZone[];
}

// ข้อมูลสำหรับแสดงกราฟของข้อบกพร่อง
export interface IDefectCategory {
    chartData: IDefectCategoryItem[];
    trend: number;
}

// ข้อมูลสำหรับแสดงกราฟของปัญหาที่พบบ่อย
export interface IDefectCategoryItem {
    type: string;
    amounts: number;
    fill: string;
}

// ข้อมูลสำหรับแสดงกราฟของปัญหาที่พบบ่อย
export interface ICommonDefectItem {
    name: string;
    amounts: number;
    fill: string;
}

// ข้อมูลสำหรับแสดงกราฟของอัตราการความสมบูรณ์ของการตรวจตรา
export interface IPatrolCompletionRate {
    chartData: IPatrolCompletionRateItem[];
    trend: number;
    percent: number;
}

// ข้อมูลสำหรับแสดงกราฟของอัตราการความสมบูรณ์ของการตรวจตรา
export interface IPatrolCompletionRateItem {
    noDefect: number;
    withDefect: number;
}

// ข้อมูลสำหรับแสดง Card ของ Dashboard
export interface IDashboardCard {
    title: string;
    value: number;
    trend?: number;
    icon: string;
    variant: keyof typeof badgeVariants;
    positive?: boolean;
}

// ข้อมูลสำหรับแสดงกราฟระยะเวลาการตรวจตรา
export interface IPatrolDuration {
    duration: number;
}


