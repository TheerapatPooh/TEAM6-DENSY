/**
 * คำอธิบาย:
 * คอมโพเนนต์ PatrolViewLayout ใช้ในการจัดการ layout สำหรับหน้าการดูข้อมูลของ Patrol โดยจะมีการใช้ `PatrolProvider` เพื่อให้บริการข้อมูลและสถานะของ Patrol
 * ภายใน children ที่ถูกส่งเข้ามา สามารถเข้าถึงข้อมูลที่แชร์จาก context นี้ได้
 * 
 * Input:
 * - children: React.ReactNode (คอนเทนต์ที่จะแสดงภายในคอมโพเนนต์นี้)
 * 
 * Output:
 * - แสดงผล layout สำหรับหน้าการดูข้อมูล Patrol โดยมีการใช้ `PatrolProvider` เพื่อจัดการสถานะของ Patrol
**/
"use client";
import { PatrolProvider } from "@/context/patrol-context";

export default function PatrolViewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PatrolProvider>
      <div className="flex flex-col gap-4 px-6 py-4">{children}</div>
    </PatrolProvider>
  );
}
