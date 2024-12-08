import { Preset } from "@prisma/client";

export const presets: Preset[] = [
    { id: 1, title: 'Daily Cleanliness Check', description: 'การตรวจสอบความสะอาดและความปลอดภัยในพื้นที่ทำงานประจำวัน โดยเฉพาะการดูแลพื้นและความสะอาดของพื้นที่ต้อนรับ', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:16:12.000'), updatedBy: 1 },
    { id: 2, title: 'Weekly Maintenance', description: 'ตรวจสอบบำรุงรักษาเครื่องจักรและอุปกรณ์ประจำสัปดาห์ เพื่อให้แน่ใจว่าอุปกรณ์ทุกอย่างทำงานอย่างมีประสิทธิภาพ', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:17:46.000'), updatedBy: 1 },
    { id: 3, title: 'Monthly Safety Check', description: 'การตรวจสอบความปลอดภัยในโซนสำคัญประจำเดือน รวมถึงอุปกรณ์รักษาความปลอดภัยและความพร้อมของระบบรักษาความปลอดภัยต่าง ๆ', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:18:04.000'), updatedBy: 1 },
    { id: 4, title: 'Quarterly Full Inspection', description: 'การตรวจสอบเต็มรูปแบบทุก 3 เดือน รวมถึงความปลอดภัย การบำรุงรักษาอุปกรณ์ และความสะอาดของพื้นที่ทั้งหมด', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:18:22.000'), updatedBy: 1 },
];
