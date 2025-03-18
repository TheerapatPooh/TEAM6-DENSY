/**
 * คำอธิบาย:
 * ไฟล์นี้ใช้ในการสร้าง PrismaClient ที่จะเชื่อมต่อกับฐานข้อมูล และ export ให้สามารถนำไปใช้ในส่วนอื่นๆ ของแอป
 * เพื่อทำการคิวรีข้อมูลหรือทำการเขียนข้อมูลลงในฐานข้อมูล
 *
 * Input:
 * - ไม่มี
 *
 * Output:
 * - PrismaClient ที่สามารถใช้เพื่อเชื่อมต่อและทำงานกับฐานข้อมูล
**/
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
