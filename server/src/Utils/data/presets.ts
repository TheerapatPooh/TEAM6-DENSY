import { Preset } from "@prisma/client";

export const presets: Preset[] = [
    { id: 1, title: 'ASSEMBLY LINE ZONE', description: 'โซนสำหรับการประกอบชิ้นส่วนและผลิตสินค้า ตรวจสอบความเรียบร้อยของสายการผลิตและเครื่องจักร', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:16:12.000'), updatedBy: 1 },
    { id: 2, title: 'RAW MATERIALS STORAGE ZONE', description: 'พื้นที่จัดเก็บวัตถุดิบก่อนนำเข้าสู่กระบวนการผลิต ตรวจสอบความพร้อมของวัตถุดิบและความปลอดภัยในการจัดเก็บ', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:17:46.000'), updatedBy: 1 },
    { id: 3, title: 'MAINTENANCE ZONE', description: 'โซนบำรุงรักษาเครื่องจักรและอุปกรณ์ ตรวจสอบและซ่อมบำรุงเพื่อให้แน่ใจว่าอุปกรณ์ทำงานได้อย่างมีประสิทธิภาพ', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:18:04.000'), updatedBy: 1 },
    { id: 4, title: 'STORAGE ZONE', description: 'พื้นที่จัดเก็บสินค้าสำเร็จรูปหรือชิ้นส่วนที่รอการใช้งาน ควบคุมปริมาณและความถูกต้องของสต็อกสินค้า', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:18:22.000'), updatedBy: 1 },
    { id: 5, title: 'WAREHOUSE', description: 'คลังสินค้าสำหรับจัดเก็บและกระจายสินค้า ตรวจสอบสภาพแวดล้อมและความพร้อมในการขนส่ง', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:19:10.000'), updatedBy: 1 },
    { id: 6, title: 'QUALITY CONTROL', description: 'โซนตรวจสอบคุณภาพสินค้า ควบคุมมาตรฐานก่อนการส่งมอบให้กับลูกค้า', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:20:30.000'), updatedBy: 1 },
    { id: 7, title: 'SERVER ROOM', description: 'ห้องเซิร์ฟเวอร์สำหรับควบคุมและจัดเก็บข้อมูล ตรวจสอบระบบเครือข่ายและอุปกรณ์เซิร์ฟเวอร์ให้พร้อมใช้งาน', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:21:05.000'), updatedBy: 1 },
    { id: 8, title: 'TESTING LAB', description: 'ห้องปฏิบัติการทดสอบผลิตภัณฑ์ ตรวจสอบคุณสมบัติและคุณภาพของผลิตภัณฑ์ตามมาตรฐาน', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:22:14.000'), updatedBy: 1 },
    { id: 9, title: 'WORK STATION A', description: 'สถานีทำงานสำหรับพนักงาน ใช้สำหรับการดำเนินงานทางเทคนิคหรือบริหารงานทั่วไป', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:23:30.000'), updatedBy: 1 },
    { id: 10, title: 'WORK STATION B', description: 'สถานีทำงานเพิ่มเติมสำหรับการดำเนินงานเฉพาะทางหรือสนับสนุนกระบวนการผลิต', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:24:45.000'), updatedBy: 1 },
    { id: 11, title: 'TRAINING SIMULATION ZONE', description: 'โซนฝึกอบรมและจำลองสถานการณ์สำหรับพนักงาน ฝึกทักษะและทดลองกระบวนการใหม่ ๆ', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:25:52.000'), updatedBy: 1 },
    { id: 12, title: 'ENGINEERING ZONE', description: 'โซนวิศวกรรมสำหรับออกแบบและพัฒนาผลิตภัณฑ์ ตรวจสอบแผนงานและปรับปรุงกระบวนการผลิต', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:26:30.000'), updatedBy: 1 },
    { id: 13, title: 'PROTOTYPE ZONE', description: 'พื้นที่พัฒนาและทดสอบต้นแบบผลิตภัณฑ์ก่อนเข้าสู่การผลิตจริง', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:27:10.000'), updatedBy: 1 },
    { id: 14, title: 'IT ZONE', description: 'โซนสำหรับดูแลระบบไอทีและอุปกรณ์เครือข่าย ตรวจสอบและบำรุงรักษาระบบสารสนเทศ', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:28:00.000'), updatedBy: 1 },
    { id: 15, title: 'CUSTOMER SERVICE', description: 'พื้นที่ให้บริการลูกค้า ดูแลการติดต่อสื่อสารและแก้ไขปัญหาต่าง ๆ', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:29:20.000'), updatedBy: 1 },
    { id: 16, title: 'MANAGER OFFICE', description: 'ห้องทำงานของผู้จัดการ ใช้สำหรับบริหารจัดการและวางแผนงานภายในองค์กร', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:30:15.000'), updatedBy: 1 },
    { id: 17, title: 'WATER SUPPLY', description: 'พื้นที่จัดการระบบน้ำประปาและสาธารณูปโภค ตรวจสอบระบบน้ำให้พร้อมใช้งาน', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:31:10.000'), updatedBy: 1 },
    { id: 18, title: 'ELECTRICAL ZONE', description: 'โซนสำหรับควบคุมระบบไฟฟ้าและพลังงาน ตรวจสอบและบำรุงรักษาอุปกรณ์ไฟฟ้า', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:32:05.000'), updatedBy: 1 },
    { id: 19, title: 'R&D Zone', description: 'พื้นที่สำหรับการวิจัยและพัฒนาผลิตภัณฑ์ใหม่ ทดสอบแนวคิด และปรับปรุงกระบวนการผลิตให้มีประสิทธิภาพมากขึ้น', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:33:05.000'), updatedBy: 1 },
];
