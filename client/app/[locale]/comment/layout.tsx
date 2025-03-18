/**
 * คำอธิบาย:
 * คอมโพเนนต์ CommentLayout ใช้เป็น Layout สำหรับหน้าที่เกี่ยวข้องกับการแสดงความคิดเห็น
 * โดยมี Header แบบ Supervisor และโครงสร้างที่รองรับเนื้อหาภายใน
 *
 * Input:
 * - รับ children ซึ่งเป็นคอมโพเนนต์ที่ต้องการแสดงผลภายใน Layout
 *
 * Output:
 * - แสดงเนื้อหาภายในที่ถูกส่งเข้ามาพร้อมกับ Header แบบ Supervisor
**/
import Header from "@/components/header";

export default function CommentLayout({
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
