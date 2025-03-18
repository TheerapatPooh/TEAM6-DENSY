/**
 * คำอธิบาย:
 * ไฟล์นี้ใช้ในการตั้งค่าและสร้าง middleware สำหรับการจัดการ CORS ในแอป
 * โดยกำหนดแหล่งที่อนุญาตให้เข้าถึง API และตัวเลือกต่างๆ สำหรับการแลกเปลี่ยนข้อมูล
 *
 * Input:
 * - ไม่มี
 *
 * Output:
 * - `corsMiddleware`: ฟังก์ชัน middleware ที่ใช้สำหรับการจัดการ CORS ในแอป
**/
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const corsMiddleware = cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  exposedHeaders: ["Content-Length", "Authorization"],
});

export default corsMiddleware;
