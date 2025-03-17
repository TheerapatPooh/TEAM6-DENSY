/**
 * คำอธิบาย:
 * คอมโพเนนต์ PatrolDefectLayout ใช้สำหรับแสดงส่วนต่างๆ ของหน้าที่เกี่ยวกับการตรวจสอบข้อบกพร่อง (Defect) ในระบบ โดยจะแสดง Header พร้อมกับ children ที่เป็นคอนเทนต์ของหน้า
 * Header จะมีการกำหนด variant เป็น "inspector" เพื่อให้เหมาะสมกับหน้าที่เกี่ยวข้องกับการตรวจสอบ
 * 
 * Input:
 * - children: React.ReactNode (คอนเทนต์ที่จะแสดงภายในคอมโพเนนต์นี้)
 * 
 * Output:
 * - แสดงผล Header และ children ที่ถูกส่งมาในหน้า Patrol Defect
**/
import Header from "@/components/header";

export default function PatrolDefectLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
    <>
      <Header variant={"inspector"} />
      {children}
    </>
    );
  }