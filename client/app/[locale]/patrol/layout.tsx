/**
 * คำอธิบาย:
 * คอมโพเนนต์ PatrolListLayout ใช้สำหรับแสดงส่วนต่างๆ ของหน้า Patrol List โดยจะแสดง Header ที่มี variant เป็น "inspector" ซึ่งเหมาะสมกับหน้าที่เกี่ยวข้องกับการตรวจสอบภาคสนาม (Patrol List)
 * และแสดงคอนเทนต์ที่ถูกส่งเข้ามาใน children
 * 
 * Input:
 * - children: React.ReactNode (คอนเทนต์ที่จะแสดงภายในคอมโพเนนต์นี้)
 * 
 * Output:
 * - แสดงผล Header และ children ที่ถูกส่งมาในหน้า Patrol List
**/
'use client'
import Header from "@/components/header";

export default function PatrolListLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
        <Header variant="inspector" />
        {children}

    </section>
  );
}