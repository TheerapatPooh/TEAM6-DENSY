/**
 * คำอธิบาย: ไฟล์นี้ใช้สำหรับการจัดการข้อความและการแปลภาษา
 * Input: ไม่มี
 * Output: ไม่มี
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