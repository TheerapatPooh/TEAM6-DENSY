import bcrypt from "bcryptjs";
import prisma from "@Utils/database.js";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import multer from 'multer';
import { getIOInstance } from '@Utils/socket.js';
import nodemailer from 'nodemailer';
import fs from "fs";
import path from "path";
import { DefectStatus } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from 'node:crypto';
import { tr } from "@faker-js/faker";


declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

// Generate a JWT token and set it as a cookie with an expiration time
const jwtSecret = process.env.JWT_SECRET || "defaultSecretKey";
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || "refreshSecretKey";

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

    if (!user.active) {
      res.status(403).json({ message: "Your account is inactive. Please contact support." });
      return;
    }

    await prisma.session.deleteMany({ where: { userId: user.id } });
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000));
    await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionId,
        expiresAt: expiresAt,
      },
    });

    const accessToken = jwt.sign({ userId: user.id, role: user.role, sessionId }, jwtSecret, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ userId: user.id, role: user.role, sessionId }, jwtRefreshSecret, { expiresIn: "7d" });

    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login Success", accessToken, refreshToken });
    return
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
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
    const token = req.cookies.authToken;

    if (!token) {
      res.status(200).json({ message: "Already logged out" });
      return
    }

    // ตรวจสอบ JWT Token
    const decoded: any = jwt.verify(token, jwtSecret);

    // ลบ session ออกจากฐานข้อมูล
    await prisma.session.deleteMany({ where: { userId: decoded.userId } });

    // Clear the cookie named "authToken"
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
    });
    res.status(200).json({ message: "Logout successful" });
    return
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
    return
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
export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authToken;

  if (!token) {
    res.status(401).json({ status: 401, message: "Access Denied, No Token Provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    const session = await prisma.session.findUnique({
      where: { userId: decoded.userId },
    });

    if (!session || session.token !== decoded.sessionId) {
      res.clearCookie("authToken");
      res.clearCookie("refreshToken");
      res.status(401).json({ message: "Session expired" });
      return
    }

    // เพิ่มตรวจสอบเวลา Session หมดอายุ
    if (session && new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } });
      res.clearCookie("authToken");
      res.clearCookie("refreshToken");
      res.status(401).json({ message: "Session expired" });
      return
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token", error })
    return
  }
}

export async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded: any = jwt.verify(refreshToken, jwtRefreshSecret);

    // ตรวจสอบ session ใน MySQL
    const session = await prisma.session.findUnique({ where: { userId: decoded.userId } });

    if (!session || session.token !== decoded.sessionId) {
      res.clearCookie("authToken");
      res.clearCookie("refreshToken");
      res.status(401).json({ message: "Session expired, please login again" });
      return
    }
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } });
      res.clearCookie("authToken");
      res.clearCookie("refreshToken");
      res.status(401).json({ message: "Session expired" });
      return
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    // สร้าง accessToken ใหม่
    const newAccessToken = jwt.sign({ userId: decoded.userId, role: user?.role, sessionId: decoded.sessionId }, jwtSecret, {
      expiresIn: "1h",
    });

    res.cookie("authToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000, // 1 ชั่วโมง
    });

    res.status(200).json({ accessToken: newAccessToken });
    return
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
}


/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูลการแจ้งเตือน
 * Input: 
 * - (req as any).user.userId : Int (Id ของผู้ใช้ที่กำลังล็อคอิน)
 * Output: JSON message ของ notification  
**/
export async function getAllNotifications(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { timestamp: 'desc' },
    });
    let result = notifications;

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
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
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
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
    res.status(500).json({ message: `Internal server error: ${error}` });
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
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
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
    res.status(200)
    return
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
        userId: userId,
      },
    });
    res.status(200)
    return
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
export function authorized(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user.role;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ message: `Access Denied: Required roles are ${allowedRoles.join(", ")}` });
      return;
    }
    next();
  };
}

export const calculateTrend = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
};


/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัพโหลดรูปภาพโดยใช้ multer
 * Input: 
 * - req.file: Object (ไฟล์รูปภาพที่อัปโหลด โดย multer จะทำการจัดการและเพิ่มลงใน `uploads/`)
 * - req.body: Object (ข้อมูลเพิ่มเติมที่แนบมากับการอัปโหลดรูปภาพ)
 * Output: 
 * - ไฟล์ที่อัปโหลดจะถูกจัดเก็บในโฟลเดอร์ `uploads/` พร้อมกับชื่อไฟล์ที่ไม่ซ้ำกัน
 * - req.file: Object (รายละเอียดของไฟล์ที่ถูกอัปโหลด เช่น ชื่อไฟล์, ขนาดไฟล์, และประเภทของไฟล์)
**/
const profileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const userId = (req as any).user.userId;
    const folderPath = path.join('uploads', 'profiles', userId.toString());

    fs.mkdirSync(folderPath, { recursive: true });
    callback(null, folderPath);
  },
  filename: (req, file, callback) => {
    const userId = (req as any).user.userId;
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const uniqueSuffix = `${userId}_${timestamp}_${file.originalname}`;
    callback(null, uniqueSuffix);
  },
});

const defectStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const id = req.params.id;
    const status = req.body.status;

    if (!id || !status) {
      return callback(new Error("defectId and status are required"), "");
    }

    const folderType = status === 'reported' ? 'before' : 'after';
    // ปรับโครงสร้างโฟลเดอร์ที่ต้องการให้เป็น uploads/defects/id/folderType
    const folderPath = path.join('uploads', 'defects', id.toString(), folderType);

    fs.mkdirSync(folderPath, { recursive: true });
    callback(null, folderPath);
  },
  filename: (req, file, callback) => {
    const id = req.params.id;
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const uniqueSuffix = `${id}_${timestamp}_${file.originalname}`;
    callback(null, uniqueSuffix);
  },
});


// Export the multer upload middleware
export const profileUpload = multer({ storage: profileStorage });
export const defectUpload = multer({ storage: defectStorage });

function getUploadsPath(): string {
  const currentDir = process.cwd();
  return path.join(currentDir, "uploads"); // Adjust path as needed
}

export const uploadsPath = getUploadsPath();

export const uploadDefectImages = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { status } = req.body;
    let images: any[] = [];

    if (req.files) {
      const imageFiles = req.files as Express.Multer.File[];
      images = await handleDefectImagesUpload(
        parseInt(id),
        status as DefectStatus,
        userId,
        imageFiles
      );
    }

    res.status(200).json({ message: "Files uploaded successfully", images: images, });
  } catch (error) {
    res.status(500).json({ error: "File upload failed" });
  }
};

export const handleDefectImagesUpload = async (
  defectId: number,
  status: DefectStatus,
  updatedBy: number,
  files: Express.Multer.File[]
) => {
  const createdImages: any[] = [];
  for (const file of files) {
    const folderType =
      status === 'reported' ? 'before' : 'after';
    // สร้าง folderPrefix ตามที่ได้กำหนดใน multer diskStorage
    const folderPath = path.join('defects', defectId.toString(), folderType);

    // ใช้ filename ที่ได้จาก multer diskStorage (filename ที่ใช้จะต้องอยู่ในโครงสร้างเดียวกัน)
    const filePath = path.join(folderPath, file.filename);

    const image = await prisma.image.create({
      data: {
        path: filePath,
        updatedBy: updatedBy,
        timestamp: new Date(),
      },
      include: {
        user: {
          select: {
            id: true
          }
        },
      }
    });

    await prisma.defectImage.create({
      data: {
        defectId: defectId,
        imageId: image.id,
      },
    });
    createdImages.push({ image });
  }
  return createdImages;
};

// ฟังก์ชันจัดกลุ่มรูปภาพตามช่วงเวลา
const groupImagesByTimestamp = (
  images: Array<{
    id: number;
    timestamp: Date;
    updatedBy: number;
    path: string;
  }>,
  thresholdMs: number
) => {
  if (images.length === 0) return [];

  const groups: Array<Array<{
    id: number;
    timestamp: Date;
    updatedBy: number;
    path: string;
  }>> = [];
  let currentGroup = [images[0]];
  let currentTime = images[0].timestamp.getTime();

  for (let i = 1; i < images.length; i++) {
    const imgTime = images[i].timestamp.getTime();
    if (currentTime - imgTime <= thresholdMs) {
      currentGroup.push(images[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [images[i]];
      currentTime = imgTime;
    }
  }
  groups.push(currentGroup);
  return groups;
};

export const handleDefectImagesUpdate = async (
  defectId: number,
  status: DefectStatus,
  options: {
    updatedBy: number;
    supervisorId?: number;
    deleteExistingImages?: boolean;
    files: Express.Multer.File[];
  }
) => {
  // ลบภาพเดิมตามเงื่อนไข
  const existingDefectImages = await prisma.defectImage.findMany({
    where: { defectId },
    select: { imageId: true },
  });

  const existingImages = await prisma.image.findMany({
    where: { id: { in: existingDefectImages.map((img) => img.imageId) } },
    select: { id: true, path: true, updatedBy: true, timestamp: true },
    orderBy: { timestamp: 'desc' },
  });

  // เงื่อนไขลบภาพเมื่ออัปเดต
  if (status === 'reported') {
    // ลบทั้งหมดเมื่อสถานะเป็น reported

    await deleteImages(existingImages.map(img => img.id))
  } else if (
    status === 'resolved' &&
    options.deleteExistingImages &&
    options.supervisorId
  ) {
    // กลุ่มรูปภาพตามเวลาที่ใกล้เคียง (1 วินาที)
    const grouped = groupImagesByTimestamp(existingImages, 1 * 1000);
    const latestGroup = grouped[0] || [];

    // กรองเฉพาะรูปของ supervisor ปัจจุบัน
    const authorizedImages = latestGroup.filter(
      img => img.updatedBy === options.supervisorId
    );
    let defect = await prisma.defect.findFirst({
      where: {
        id: defectId
      },
      select: {
        status: true
      }
    })
    defect?.status === 'resolved' as DefectStatus ? await deleteImages(authorizedImages.map(img => img.id)) : undefined

  }


  // อัปโหลดภาพใหม่
  await handleDefectImagesUpload(
    defectId,
    status,
    options.updatedBy,
    options.files
  )
}

// ฟังก์ชันช่วยลบภาพ
export const deleteImages = async (imageIds: number[]) => {
  if (imageIds.length === 0) return

  // ลบไฟล์จากระบบ
  const imagesToDelete = await prisma.image.findMany({
    where: { id: { in: imageIds } },
    select: { path: true },
  })

  imagesToDelete.forEach((image) => {
    const filePath = path.join(uploadsPath, image.path)
    try {
      fs.unlinkSync(filePath)
    } catch (error) {
      console.error(`Failed to delete file at ${filePath}:`, error)
    }
  })

  // ลบข้อมูลจากฐานข้อมูล
  await prisma.$transaction([
    prisma.defectImage.deleteMany({
      where: { imageId: { in: imageIds } }
    }),
    prisma.image.deleteMany({
      where: {
        id: { in: imageIds }
      }
    })
  ])
}

export async function sendEmailResetPassword(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return
  }

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExpires: expiresAt,
    },
  });

  // สร้างลิงก์ reset password
  const resetLink = `${process.env.CLIENT_URL}/en/login/forgot-password?token=${token}`;

  // ส่งอีเมล
  const emailSubject = "Reset Your Password";
  const emailMessage = `Click the link to reset your password: ${resetLink}`;

  await sendEmail(email, emailSubject, emailMessage);

  res.status(200).json({ message: "Reset password email sent" });
  return
}

export async function resetForgotPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: { resetToken: token },
      select: {
        id: true,
        password: true,
      }
    });

    if (!user) {
      res.status(404).json({ message: 'Invalid token or user not found.' });
      return
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // อัปเดตผู้ใช้ด้วยรหัสผ่านใหม่และรีเซ็ต token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    });

    res.status(200).json({ message: 'Password successfully updated.', status: 200 });
    return
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
    return
  }
}

export async function verifyToken(req: Request, res: Response) {
  try {
    const token = req.query.token

    if (!token) {
      res.status(400).json({ message: "Token is required" });
      return
    }

    const user = await prisma.user.findFirst({
      where: { resetToken: token.toString() },
      select: {
        resetTokenExpires: true
      }
    });

    if (!user) {
      res.status(404).json({ message: "Token not found or invalid" });
      return
    }

    if (user.resetTokenExpires && new Date(user.resetTokenExpires) < new Date()) {
      res.status(404).json({ message: "Token has expired" });
      return;
    }

    res.status(200).json({ status: 200, message: "Token is valid" });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ message: "Server error" });
  }
}
