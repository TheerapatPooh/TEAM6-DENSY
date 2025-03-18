/**
 * คำอธิบาย:
 *   คอมโพเนนต์ RootPage ทำหน้าที่เป็นหน้าหลักของแอปพลิเคชัน และจะทำการ Redirect ผู้ใช้ไปยังหน้าหลักของภาษาอังกฤษ ('/en')
 *   โดยอัตโนมัติเมื่อเข้าถึงหน้านี้
 *
 * Input:
 * - ไม่มี Input ที่รับเข้ามาโดยตรง
 *
 * Output:
 * - ใช้ `redirect('/en')` จาก Next.js เพื่อเปลี่ยนเส้นทางไปยังหน้า `/en`
**/
import { redirect } from "next/navigation"

export default function RootPage() {
  redirect('/en')
}