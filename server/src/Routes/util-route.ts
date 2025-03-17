/**
 * คำอธิบาย:
 * ไฟล์นี้ใช้ในการกำหนดเส้นทาง (routes) สำหรับฟังก์ชันต่างๆ ที่เกี่ยวข้องกับการจัดการการเข้าสู่ระบบ, การจัดการการแจ้งเตือน, การรีเซ็ตรหัสผ่าน, และการยืนยัน token ในแอป
 * โดยใช้ Express router เพื่อกำหนดและจัดการ API endpoints ต่างๆ
 *
 * Input:
 * - ข้อมูลจาก body หรือ query parameters ที่ส่งมาจากคำขอ (เช่น ข้อมูลการล็อกอิน, ข้อความการแจ้งเตือน, รหัสผ่านที่ลืม)
 *
 * Output:
 * - ส่งคืนคำตอบจาก API เช่น ข้อความสำเร็จ, ข้อความผิดพลาด, หรือข้อมูลที่ดึงจากฐานข้อมูล (เช่น การแจ้งเตือน, การรีเซ็ตรหัสผ่าน)
**/
import {
  authenticateUser,
  removeOldNotifications,
  getAllNotifications,
  login,
  logout,
  markAllAsRead,
  updateNotification,
  removeNotification,
  removeAllNotifications,
  refreshToken,
  sendEmailResetPassword,
  resetForgotPassword,
  verifyToken,
} from "@Controllers/util-controller.js";
import { Router } from "express";
import rateLimit from "express-rate-limit";

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 นาที
  max: 5, // อนุญาตให้ลองล็อกอินได้ 5 ครั้ง
  message: { message: "Too many login attempts, please try again later" },
  headers: true,
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: ผู้ใช้สามารถเข้าสู่ระบบโดยใช้ชื่อผู้ใช้และรหัสผ่าน
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               rememberMe:
 *                 type: boolean
 *                 description: ถ้าค่าตั้งเป็น true จะทำให้ session อยู่ได้นานขึ้น
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login Success"
 *                 token:
 *                   type: string
 *                   example: "your-jwt-token-here"
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid username"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post("/login", loginLimiter, login);

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: ใช้ refresh token เพื่อขอ access token ใหม่ หาก session ยังไม่หมดอายุ
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Access token ใหม่ถูกสร้างสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Access token ใหม่
 *       401:
 *         description: ไม่มี refresh token หรือ session หมดอายุ
 *       403:
 *         description: Refresh token ไม่ถูกต้อง
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: User logout
 *     description: ผู้ใช้สามารถออกจากระบบโดยการลบคุกกี้ที่ใช้สำหรับการยืนยันตัวตน
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for a user
 *     description: ดึงข้อมูลการแจ้งเตือนทั้งหมดของผู้ใช้
 *     responses:
 *       200:
 *         description: A list of notifications for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   message:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                   type:
 *                     type: string
 *                   url:
 *                     type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/notifications", authenticateUser, getAllNotifications);

/**
 * @swagger
 * /api/notification/{id}:
 *   put:
 *     summary: Mark a notification as read
 *     description: ทำเครื่องหมายการแจ้งเตือนว่าอ่านแล้ว
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID ของการแจ้งเตือนที่ต้องการทำเครื่องหมายว่าอ่านแล้ว
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 read:
 *                   type: boolean
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.put("/notification/:id", authenticateUser, updateNotification);

/**
 * @swagger
 * /api/notification/{id}:
 *   delete:
 *     summary: Delete a notification
 *     description: ลบการแจ้งเตือนตาม ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID ของการแจ้งเตือนที่ต้องการลบ
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.delete("/notification/:id", authenticateUser, removeNotification);

/**
 * @swagger
 * /api/notifications:
 *   delete:
 *     summary: Remove all notifications for a user
 *     description: ลบการแจ้งเตือนทั้งหมดของผู้ใช้ที่ล็อกอินอยู่
 *     responses:
 *       200:
 *         description: All notifications deleted successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.delete("/notifications", authenticateUser, removeAllNotifications);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   put:
 *     summary: Mark all notifications as read
 *     description: ทำเครื่องหมายการแจ้งเตือนทั้งหมดว่าได้อ่านแล้ว
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All notifications marked as read"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.put("/notifications/mark-all-read", authenticateUser, markAllAsRead);

removeOldNotifications();

/**
 * @swagger
 * /api/send-email-reset-password:
 *   post:
 *     summary: ส่งอีเมลสำหรับรีเซ็ตรหัสผ่าน
 *     description: ส่งอีเมลที่มีลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังผู้ใช้ที่ร้องขอ
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: อีเมลของผู้ใช้ที่ต้องการรีเซ็ตรหัสผ่าน
 *     responses:
 *       200:
 *         description: ส่งอีเมลรีเซ็ตรหัสผ่านสำเร็จ
 *       400:
 *         description: ไม่มีการส่งอีเมลมาใน request
 *       404:
 *         description: ไม่พบผู้ใช้ที่มีอีเมลนี้
 */
router.post("/send-email-reset-password", sendEmailResetPassword);

/**
 * @swagger
 * /api/reset-password:
 *   put:
 *     summary: Reset password using a reset token
 *     description: อัปเดตรหัสผ่านใหม่โดยใช้โทเค็นรีเซ็ตรหัสผ่าน
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: โทเค็นสำหรับรีเซ็ตรหัสผ่าน
 *                 example: "123456abcdef"
 *               newPassword:
 *                 type: string
 *                 description: รหัสผ่านใหม่ของผู้ใช้
 *                 example: "NewSecurePassword123!"
 *     responses:
 *       200:
 *         description: Password successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password successfully updated."
 *                 status:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Invalid token or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid token or user not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error, please try again later."
 */
router.put("/reset-password", resetForgotPassword);

/**
 * @swagger
 * /api/verify-token:
 *   get:
 *     summary: Verify reset password token
 *     description: ตรวจสอบความถูกต้องของโทเค็นรีเซ็ตรหัสผ่าน
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: โทเค็นที่ใช้ในการรีเซ็ตรหัสผ่าน
 *         schema:
 *           type: string
 *           example: "123456abcdef"
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Token is valid"
 *       400:
 *         description: Token is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is required"
 *       404:
 *         description: Token not found, invalid, or expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token not found or invalid"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.get("/verify-token", verifyToken);

export default router;
