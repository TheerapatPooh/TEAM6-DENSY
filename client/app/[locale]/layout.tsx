/**
 * คำอธิบาย:
 * คอมโพเนนต์ Layout นี้ใช้ในการห่อหุ้มหน้าเว็บที่ต้องการแสดงผล โดยใช้ Suspense สำหรับการโหลดข้อมูลที่ใช้เวลา โดยจะแสดง Loading ขณะรอข้อมูล
 * การใช้งานนี้เหมาะสำหรับการแสดงผลหน้าเว็บที่มีการโหลดข้อมูลที่ต้องใช้เวลา
 *
 * Input:
 * - `children`: React.ReactNode ที่เป็นเนื้อหาของหน้าต่างๆ ที่ต้องการแสดงผลภายใน Layout นี้
 *
 * Output:
 * - แสดงผลหน้าต่างๆ ที่ถูกห่อหุ้มด้วย Suspense ซึ่งจะมี Loading แสดงขึ้นมาจนกว่าข้อมูลจะถูกโหลดเสร็จ
**/
import Loading from "@/components/loading";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </section>
  );
}
