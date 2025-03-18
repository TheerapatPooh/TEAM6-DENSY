/**
 * คำอธิบาย:
 *   ฟังก์ชันนี้ใช้สำหรับกำหนดการตั้งค่าการแสดงผลข้อความของแอปพลิเคชันโดยใช้ `next-intl` เพื่อจัดการ localization
 *   ตามค่าของ `locale` ที่ได้รับจาก URL โดยจะโหลดไฟล์ข้อความที่เกี่ยวข้องกับภาษาในระบบ (เช่น `en.json`, `th.json`)
 *   หากไม่พบ locale ที่ถูกต้องจะเรียกใช้งาน `notFound()` เพื่อแสดงหน้าผิดพลาด
 *
 * Input:
 *   - locale: ภาษา (เช่น 'en', 'th') ที่ระบุใน URL
 * Output:
 *   - ค่าของ `messages` ที่โหลดจากไฟล์ JSON ตาม locale ที่กำหนด
**/
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "th"];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
