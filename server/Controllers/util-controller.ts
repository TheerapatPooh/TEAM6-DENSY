import bcrypt from "bcrypt";
import { prisma } from "../Utils/database";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken'
import multer, { Multer } from 'multer';
const jwt = require('jsonwebtoken')
import { getIOInstance } from '../Utils/socket'; 
import { Notification } from "@prisma/client";




declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

export async function login(req: Request, res: Response) {
  const { username, password, rememberMe } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { us_username: username },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" })
    }

    const passwordMatch = await bcrypt.compare(password, user.us_password)

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" })
    }
    const token = jwt.sign({ userId: user.us_id, role: user.us_role }, process.env.JWT_SECRET, { expiresIn: "1h" })
    // Set HttpOnly cookie with the token
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: maxAge
    })

    res.status(200).json({ message: "Login Success", token })
  } catch (error) {
    res.status(500).json({ message: "Login failed", error })
  }
}


export async function logout(req: Request, res: Response) {
  try {
    // ลบ cookie authToken
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
    return res.status(401).json({ message: "Access Denied, No Token Provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" })
  }
}



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



export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const notifications = await prisma.notification.findMany({
      where: { nt_us_id: userId },
      orderBy: { nt_timestamp: 'desc' },
    });

    res.status(200).json(notifications);
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

    const io = getIOInstance();
    io.to(nt_us_id).emit('new_notification', notification);  

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

    const deletedNotifications = await prisma.notification.deleteMany({
      where: {
        nt_timestamp: {
          lt: sevenDaysAgo, 
        },
      },
    });

    console.log(`${deletedNotifications.count} notifications deleted.`);
  } catch (error) {
    console.error("Error deleting old notifications:", error);
  }
}