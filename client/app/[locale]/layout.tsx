/**
 * คำอธิบาย:
 * คอมโพเนนต์ Layout นี้ใช้ในการห่อหุ้มหน้าเว็บที่ต้องการแสดงผล โดยไม่จำเป็นต้องใช้ Suspense ในระดับ Layout 
 * เพราะ Next.js 14 App Router มีกลไก `loading.tsx` ที่จัดการ Loading อัตโนมัติเมื่อมีการโหลดข้อมูลหรือเปลี่ยนหน้า
 * หน้าที่ของ Layout นี้คือกำหนดโครงสร้างพื้นฐานของหน้าเว็บ และส่งต่อ `children` (เนื้อหาของหน้า) ไปยังส่วนที่ต้องการแสดงผล
 *
 * Input:
 * - `children`: React.ReactNode ที่เป็นเนื้อหาของหน้าต่างๆ ที่ต้องการแสดงผลภายใน Layout นี้
 *
 * Output:
 * - แสดงผลหน้าต่างๆ ที่ถูกห่อหุ้มด้วยโครงสร้าง Layout
**/
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      {children}
    </section>
  );
}
