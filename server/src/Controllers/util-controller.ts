import bcrypt from "bcryptjs";
import { prisma } from "@Utils/database.js";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import multer from 'multer';
import { getIOInstance } from '@Utils/socket.js';
import nodemailer from 'nodemailer';
import transformKeys, { keyMap } from "@Utils/key-map.js";




declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}
//Login
export async function login(req: Request, res: Response) {
  const { username, password, rememberMe } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { us_username: username },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid username or password" })
      return
    }

    const passwordMatch = await bcrypt.compare(password, user.us_password)

    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid username or password" })
      return
    }
    const jwtSecret = process.env.JWT_SECRET || "defaultSecretKey";
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + maxAge / 1000
    const token = jwt.sign({ userId: user.us_id, role: user.us_role, iat, exp }, jwtSecret)

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: maxAge
    })

    res.status(200).json({ message: "Login Success", token })
  } catch (error) {
    res.status(500).json({ message: "Login failed", error })
  }
}

//Logout
export async function logout(req: Request, res: Response) {
  try {
    // ลบ cookie authToken
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    // ส่ง response กลับไปหาผู้ใช้เพื่อแจ้งว่า logout สำเร็จ
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
}

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authToken

  if (!token) {
    res.status(401).json({ message: "Access Denied, No Token Provided" })
    return
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "defaultSecretKey"
    const decoded = jwt.verify(token, jwtSecret)
    req.user = decoded
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" , error})
    return
  }
}



//Upload Image
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/'); // Keep the upload path for file storage
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    callback(null, uniqueSuffix); // Store only the filename
  }
});

export const upload = multer({ storage: storage });



//Notification
export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const notifications = await prisma.notification.findMany({
      where: { nt_us_id: userId },
      orderBy: { nt_timestamp: 'desc' },
    });
    let result = transformKeys(notifications, keyMap);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
}

export async function createNotification({ nt_message, nt_type, nt_url, nt_us_id }: any) {
  try {
    const notification = await prisma.notification.create({
      data: {
        nt_message,
        nt_timestamp: new Date(),
        nt_type,
        nt_url,
        nt_read: false,
        nt_us_id,
      },
    });

    const user = await prisma.user.findUnique({
      where: { us_id: nt_us_id },
      select: { us_email: true },
    });

    // ส่งอีเมลแจ้งเตือนไปยังผู้ใช้
    if (user?.us_email) {
      const emailSubject = 'New Notification';
      const emailMessage = `You have a new notification: ${nt_message}. Check it here: ${nt_url}`;

      await sendEmail(user.us_email, emailSubject, emailMessage);
    }
    let result = transformKeys(notification, keyMap);

    const io = getIOInstance();
    io.to(nt_us_id).emit('new_notification', result);

    return notification;
  } catch (error) {
    console.error("Error creating notification", error);
  }
}

export async function updateNotification(req: Request, res: Response) {
  try {
    const { id } = req.params
    const notification = await prisma.notification.update({
      where: { nt_id: parseInt(id, 10) },
      data: { nt_read: true },
    });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
}

export async function markAllAsRead(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    await prisma.notification.updateMany({
      where: { nt_us_id: userId, nt_read: false },
      data: { nt_read: true },
    });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications", error });
  }
}

export async function deleteOldNotifications() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await prisma.notification.deleteMany({
      where: {
        nt_timestamp: {
          lt: sevenDaysAgo,
        },
      },
    });
  } catch (error) {
    console.error("Error deleting old notifications:", error);
  }
}


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//Send Email
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