/**
 * คำอธิบาย:
 * คอมโพเนนต์ DefectLayout ใช้เป็น Layout หลักของหน้าที่เกี่ยวข้องกับการจัดการ Defect
 * โดยจะมี Header สำหรับ Supervisor และแสดงเนื้อหาภายในผ่าน children
 *
 * Input:
 * - children: React.ReactNode (เนื้อหาภายใน Layout)
 *
 * Output:
 * - โครงสร้างของหน้าพร้อม Header และเนื้อหา
**/
import Header from "@/components/header";

export default function DefectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <Header variant="supervisor" />
      <div className="px-6 py-4">{children}</div>
    </section>
  );
}
