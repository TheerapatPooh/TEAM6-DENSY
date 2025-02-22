import { authenticateUser, removeOldNotifications, getAllNotifications, login, logout, markAllAsRead, updateNotification, removeNotification, removeAllNotifications } from "@Controllers/util-controller.js";
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
removeOldNotifications()

export default router
