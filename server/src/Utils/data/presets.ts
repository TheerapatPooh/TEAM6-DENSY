import { Preset } from "@prisma/client";

export const presets: Preset[] = [
    { ps_id: 1, ps_title: 'Daily Cleanliness Check', ps_description: 'การตรวจสอบความสะอาดและความปลอดภัยในพื้นที่ทำงานประจำวัน โดยเฉพาะการดูแลพื้นและความสะอาดของพื้นที่ต้อนรับ', ps_version: 1, ps_latest: true, ps_update_at: new Date('2024-10-06 17:16:12.000'), ps_us_id: 1 },
    { ps_id: 2, ps_title: 'Weekly Maintenance', ps_description: 'ตรวจสอบบำรุงรักษาเครื่องจักรและอุปกรณ์ประจำสัปดาห์ เพื่อให้แน่ใจว่าอุปกรณ์ทุกอย่างทำงานอย่างมีประสิทธิภาพ', ps_version: 1, ps_latest: true, ps_update_at: new Date('2024-10-06 17:17:46.000'), ps_us_id: 1 },
    { ps_id: 3, ps_title: 'Monthly Safety Check', ps_description: 'การตรวจสอบความปลอดภัยในโซนสำคัญประจำเดือน รวมถึงอุปกรณ์รักษาความปลอดภัยและความพร้อมของระบบรักษาความปลอดภัยต่าง ๆ', ps_version: 1, ps_latest: true, ps_update_at: new Date('2024-10-06 17:18:04.000'), ps_us_id: 1 },
    { ps_id: 4, ps_title: 'Quarterly Full Inspection', ps_description: 'การตรวจสอบเต็มรูปแบบทุก 3 เดือน รวมถึงความปลอดภัย การบำรุงรักษาอุปกรณ์ และความสะอาดของพื้นที่ทั้งหมด', ps_version: 1, ps_latest: true, ps_update_at: new Date('2024-10-06 17:18:22.000'), ps_us_id: 1 },
];
