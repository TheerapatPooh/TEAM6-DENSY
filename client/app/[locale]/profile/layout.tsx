/**
 * คำอธิบาย:
 * คอมโพเนนต์ ProfileLayout เป็นเลย์เอาต์ที่ใช้สำหรับแสดงส่วนต่างๆ ของหน้าประวัติผู้ใช้ โดยจะมีการแสดงผล Header พร้อมด้วย children ที่จะถูกแสดงในส่วนหลักของหน้า
 * ใช้สำหรับการจัดระเบียบโครงสร้างของหน้า Profile โดย Header จะมีการกำหนด variant เป็น "profile"
 * 
 * Input:
 * - children: React.ReactNode (คอนเทนต์ที่จะแสดงภายในคอมโพเนนต์นี้)
 * 
 * Output:
 * - แสดง Header และ children ที่ผ่านเข้ามาในหน้า Profile
**/
import Header from "@/components/header";

export default function ProfileLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
    <section>
      <Header variant={"profile"} />
      {children}
    </section>
    );
  }