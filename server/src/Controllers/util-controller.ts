import bcrypt from "bcryptjs";
import { prisma } from "@Utils/database.js";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import multer from 'multer';
import { getIOInstance } from '@Utils/socket.js';
import nodemailer from 'nodemailer';

// Extend the Express Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

// Login function to authenticate a user, generate a JWT, and set it as a cookie
export async function login(req: Request, res: Response) {
  const { username, password, rememberMe } = req.body;
  try {
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid username or password" });
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
    res.status(500).json({ message: "Login failed", error });
  }
}

// Logout function to clear the authentication token cookie
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
    res.status(500).json({ message: "Logout failed", error });
  }
}

// Middleware function to authenticate a user based on the JWT token
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
    res.status(400).json({ message: "Invalid Token", error });
    return;
  }
}

// Multer configuration for image file uploads
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/'); // Path where the uploaded files will be stored
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    callback(null, uniqueSuffix); // Append unique timestamp to the filename
  }
});

// Export the multer upload middleware
export const upload = multer({ storage: storage });

// Function to get notifications for the currently authenticated user
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
    res.status(500).json({ message: "Error fetching notifications", error });
  }
}

// Function to create a new notification and send an email to the user if an email is provided
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

// Function to update a specific notification and mark it as read
export async function updateNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id: parseInt(id, 10) },
      data: { read: true },
    });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
}

// Function to mark all unread notifications as read for the authenticated user
export async function markAllAsRead(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    await prisma.notification.updateMany({
      where: { userId: userId, read: false },
      data: { read: true },
    });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications", error });
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
    res.status(500).json({ message: "Error updating notification", error });
  }
}

// Function to remove notifications older than seven days from the database
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

// Function to delete a specific notification by ID
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

// Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send an email notification
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
