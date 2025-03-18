/**
 * คำอธิบาย:
 * คอมโพเนนต์ `LoadingPage` นี้เป็นหน้าที่แสดงผล Loading Indicator 
 * โดยหน้าที่นี้จะถูกเรียกใช้โดยอัตโนมัติเมื่อมีการโหลดข้อมูลหรือเปลี่ยนหน้าใน Next.js 14 App Router
 * 
 * หน้าที่นี้ใช้คอมโพเนนต์ `Loading` จาก `@/components/loading` เพื่อแสดงผล Loading Indicator 
 * ที่กำหนดเอง (เช่น Spinner, Skeleton, หรือ Animation)
 *
 * Input:
 * - ไม่มี Input โดยตรง เนื่องจากหน้าที่นี้ถูกเรียกใช้โดย Next.js อัตโนมัติ
 *
 * Output:
 * - แสดงผล Loading Indicator ที่กำหนดไว้ในคอมโพเนนต์ `Loading`
**/
import Loading from "@/components/loading";

export default function LoadingPage() {
  return <Loading />;
}