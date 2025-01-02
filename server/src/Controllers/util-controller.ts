import bcrypt from "bcryptjs";
import prisma from "@Utils/database.js";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import multer from 'multer';
import { getIOInstance } from '@Utils/socket.js';
import nodemailer from 'nodemailer';

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับ login เข้าสู่ระบบ
 * Input: 
 * - req.body: { username: String, password: String, rememberMe: Boolean}
 * Output: JSON message ยืนยันการ login สำเร็จ
**/
export async function login(req: Request, res: Response) {
  const { username, password, rememberMe } = req.body;
  try {
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid username" });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    // Generate a JWT token and set it as a cookie with an expiration time
    const jwtSecret = process.env.JWT_SECRET || "defaultSecretKey";
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000;
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + maxAge / 1000;
    const token = jwt.sign({ userId: user.id, role: user.role, iat, exp }, jwtSecret);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: maxAge,
    });

    res.status(200).json({ message: "Login Success", token });
  } catch (error) {
    res.status(500)
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับ logout ออกจากระบบ
 * Input: 
 * - req.cookies.authToken: String (Token ของผู้ใช้งานที่ใช้สำหรับการยืนยันตัวตน) 
 * Output: JSON message ยืนยันการ logout สำเร็จ
**/
export async function logout(req: Request, res: Response) {
  try {
    // Clear the cookie named "authToken"
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500)
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับตรวจสอบการยืนยันตัวตนของผู้ใช้งาน (Authentication)
 * Input: 
 * - req.cookies.authToken: String (Token ของผู้ใช้งานที่ใช้สำหรับการยืนยันตัวตน) 
 * Output: 
 * - ถ้า Token ถูกต้อง: ส่งต่อการทำงานไปยังฟังก์ชันถัดไป (next middleware)
 * - ถ้า TOken ไม่ถูกต้อง: JSON message แจ้งเตือนข้อผิดพลาด เช่น "Access Denied" หรือ "Invalid Token"
**/
export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authToken;

  if (!token) {
    res.status(401).json({ message: "Access Denied, No Token Provided" });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "defaultSecretKey";
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token", error })
    return
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัพโหลดรูปภาพโดยใช้ multer
 * Input: 
 * - req.file: Object (ไฟล์รูปภาพที่อัปโหลด โดย multer จะทำการจัดการและเพิ่มลงใน `uploads/`)
 * - req.body: Object (ข้อมูลเพิ่มเติมที่แนบมากับการอัปโหลดรูปภาพ)
 * Output: 
 * - ไฟล์ที่อัปโหลดจะถูกจัดเก็บในโฟลเดอร์ `uploads/` พร้อมกับชื่อไฟล์ที่ไม่ซ้ำกัน
 * - req.file: Object (รายละเอียดของไฟล์ที่ถูกอัปโหลด เช่น ชื่อไฟล์, ขนาดไฟล์, และประเภทของไฟล์)
**/
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/'); // กำหนดโฟลเดอร์สำหรับเก็บไฟล์ที่อัปโหลด
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + file.originalname; // ตั้งชื่อไฟล์ใหม่ให้ไม่ซ้ำกัน
    callback(null, uniqueSuffix);  // บันทึกชื่อไฟล์
  }
});

// Export the multer upload middleware
export const upload = multer({ storage: storage });

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูลการแจ้งเตือน
 * Input: 
 * - (req as any).user.userId : Int (Id ของผู้ใช้ที่กำลังล็อคอิน)
 * Output: JSON message ของ notification  
**/
export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { timestamp: 'desc' },
    });
    let result = notifications;

    res.status(200).json(result);
  } catch (error) {
    res.status(500)
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสร้างการแจ้งเตือน
 * Input: 
 * - req.body: { message: string, type: NotificationType, url: String | Null, userId: Int }
 * Output: JSON object ของ notification ที่ถูกสร้าง รวมถึงข้อมูลที่เกี่ยวข้อง 
**/
export async function createNotification({ message, type, url, userId }: any) {
  try {
    const notification = await prisma.notification.create({
      data: {
        message,
        timestamp: new Date(),
        type,
        url,
        read: false,
        userId,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    // Send an email notification if the user's email exists
    if (user?.email) {
      const emailSubject = 'New Notification';
      const emailMessage = `You have a new notification: ${message}. Check it here: ${url}`;

      await sendEmail(user.email, emailSubject, emailMessage);
    }

    let result = notification;

    // Emit an event to notify the client in real-time
    const io = getIOInstance();
    io.to(userId).emit('new_notification', result);

    return notification;
  } catch (error) {
    console.error("Error creating notification", error);
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัปเดตสถานะการแจ้งเตือนให้เป็น "อ่านแล้ว"
 * Input: 
 * - req.params: { id: int } (ID ของการแจ้งเตือนที่ต้องการอัปเดต)
 * Output: JSON object ของการแจ้งเตือนที่ถูกอัปเดต 
**/
export async function updateNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id: parseInt(id, 10) },
      data: { read: true },
    });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500)
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับเปลี่ยนสถานะการแจ้งเตือนทั้งหมดของผู้ใช้ให้เป็น "อ่านแล้ว"
 * Input: 
 * - req.user.userId: int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: 
 * - JSON message ยืนยันการเปลี่ยนสถานะการแจ้งเตือนสำเร็จ
**/
export async function markAllAsRead(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    await prisma.notification.updateMany({
      where: { userId: userId, read: false },
      data: { read: true },
    });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500)
  }
}

// Function to mark a specific notification as read by checking its ID
export async function markAsRead(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if the notification exists and is unread
    const notification = await prisma.notification.findFirst({
      where: {
        id: parseInt(id),
        read: false,
      },
    });

    if (!notification) {
      return res.status(404).json({ message: "No unread notifications found" });
    }

    // Update the notification to mark it as read
    await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { read: true },
    });

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500)
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับลบการแจ้งเตือนที่มีอายุเกิน 7 วัน
 * Input: 
 * - ไม่มี Input
 * Output: 
 * - ไม่มี Output ที่ส่งกลับ แต่จะลบการแจ้งเตือนเก่าจากฐานข้อมูล
**/
export async function removeOldNotifications() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await prisma.notification.deleteMany({
      where: {
        timestamp: {
          lt: sevenDaysAgo,
        },
      },
    });
  } catch (error) {
    console.error("Error deleting old notifications:", error);
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับลบการแจ้งเตือนที่ต้องการ
 * Input: 
 * - req.param = id
 * Output: 
 * - ไม่มี Output ที่ส่งกลับ แต่จะลบการแจ้งเตือนออกจากฐานข้อมูล
**/
export async function removeNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.notification.delete({
      where: {
        id: parseInt(id),
      },
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับลบการแจ้งเตือนที่ต้องการ
 * Input: 
 * - req.user: { userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: 
 * - ไม่มี Output ที่ส่งกลับ แต่จะลบการแจ้งเตือนทั้งหมดของผู้ใช้ออกจากฐานข้อมูล
**/
export async function removeAllNotifications(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  try {
    await prisma.notification.deleteMany({
      where: {
        userId: parseInt(userId),
      },
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
}

// Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * คำอธิบาย: ฟังก์ชันสำหรับส่งอีเมลโดยใช้ nodemailer
 * Input: 
 * - email: String (อีเมลผู้รับ)
 * - subject: String (หัวข้อของอีเมล)
 * - message: String (ข้อความในเนื้อหาอีเมล)
 * Output: 
 * - ไม่มี Output ที่ส่งกลับ แต่จะทำการส่งอีเมล
**/
export async function sendEmail(email: string, subject: string, message: string) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับตรวจสอบสิทธิ์การเข้าถึง
 * Input: 
 * - allowedRoles: string[] (role ที่อณุญาติให้เข้าถึงข้อมูล)
 * Output: 
 * - ทำ Function  ต่อไป
**/
export function authorzied(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user.role;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ message: `Access Denied: Required roles are ${allowedRoles.join(", ")}` });
      return;
    }
    next();
  };
}