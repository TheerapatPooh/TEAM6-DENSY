import { createUser, getUser, updateProfile, getAllUsers, updateUser, removeUser } from "@Controllers/user-controller.js";
import { Router } from 'express'
import { authenticateUser, authorized } from "@Controllers/util-controller.js";
import { profileUpload } from "@Controllers/util-controller.js";
const router = Router()

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: ดึงข้อมูลผู้ใช้ทั้งหมดตามบทบาทที่กำหนด และสามารถกรองข้อมูลโปรไฟล์ รูปภาพ หรือชื่อผู้ใช้
 *     parameters:
 *       - in: query
 *         name: profile
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: ถ้ากำหนดเป็น "true" จะรวมข้อมูลโปรไฟล์ของผู้ใช้
 *       - in: query
 *         name: image
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: ถ้ากำหนดเป็น "true" จะรวมข้อมูลรูปภาพโปรไฟล์ของผู้ใช้
 *       - in: query
 *         name: user
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: ถ้ากำหนดเป็น "true" จะรวมข้อมูลชื่อผู้ใช้ของผู้ใช้
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["admin", "inspector", "supervisor"]
 *         description: กรองตามบทบาทของผู้ใช้ (admin, inspector, supervisor)
 *     responses:
 *       200:
 *         description: รายละเอียดผู้ใช้ทั้งหมด
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   active:
 *                     type: boolean
 *                   profile:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       age:
 *                         type: integer
 *                       tel:
 *                         type: string
 *                       address:
 *                         type: string
 *                       image:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           path:
 *                             type: string
 *       404:
 *         description: ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No users found"
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
router.get('/users', authenticateUser, getAllUsers)

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user information
 *     description: ดึงข้อมูลผู้ใช้ที่ตรงกับ ID หรือข้อมูลของผู้ใช้ที่ล็อกอิน
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของผู้ใช้ที่ต้องการดึงข้อมูล
 *       - in: query
 *         name: profile
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: ถ้ากำหนดเป็น "true" จะรวมข้อมูลโปรไฟล์ของผู้ใช้
 *       - in: query
 *         name: image
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: ถ้ากำหนดเป็น "true" จะรวมข้อมูลรูปภาพโปรไฟล์ของผู้ใช้
 *       - in: query
 *         name: password
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: ถ้ากำหนดเป็น "true" จะรวมข้อมูลรหัสผ่านของผู้ใช้
 *     responses:
 *       200:
 *         description: ข้อมูลของผู้ใช้
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                   description: รหัสผ่าน (ถ้ามีการระบุใน query string)
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 active:
 *                   type: boolean
 *                 profile:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     age:
 *                       type: integer
 *                     tel:
 *                       type: string
 *                     address:
 *                       type: string
 *                     image:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         path:
 *                           type: string
 *       403:
 *         description: "Access Denied: Only admins can access other users' data"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access Denied: Only admins can access other users' data"
 *       404:
 *         description: ไม่พบผู้ใช้ที่ตรงกับ ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
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
router.get('/user/:id?', authenticateUser, getUser)

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user
 *     description: สร้างผู้ใช้ใหม่พร้อมโปรไฟล์เริ่มต้น
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: ชื่อผู้ใช้ของผู้ใช้ใหม่
 *               email:
 *                 type: string
 *                 format: email
 *                 description: อีเมล์ของผู้ใช้ใหม่
 *               password:
 *                 type: string
 *                 description: รหัสผ่านของผู้ใช้ใหม่
 *               role:
 *                 type: string
 *                 description: บทบาทของผู้ใช้ (เช่น inspector)
 *                 default: "inspector"
 *               department:
 *                 type: string
 *                 description: แผนกของผู้ใช้
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 department:
 *                   type: string
 *                 profile:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     age:
 *                       type: integer
 *                     tel:
 *                       type: string
 *                     address:
 *                       type: string
 *                     image:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         path:
 *                           type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/user', authenticateUser, authorized(['admin']), createUser)

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     description: อัปเดตข้อมูลโปรไฟล์ของผู้ใช้ รวมถึงการอัปโหลดภาพโปรไฟล์ใหม่
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: ชื่อของผู้ใช้
 *               age:
 *                 type: integer
 *                 description: อายุของผู้ใช้
 *               tel:
 *                 type: string
 *                 description: หมายเลขโทรศัพท์ของผู้ใช้
 *               address:
 *                 type: string
 *                 description: ที่อยู่ของผู้ใช้
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: รูปภาพโปรไฟล์ของผู้ใช้
 *     responses:
 *       200:
 *         description: ข้อมูลโปรไฟล์ถูกอัปเดตสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 tel:
 *                   type: string
 *                 address:
 *                   type: string
 *                 imageId:
 *                   type: integer
 *                   description: ID ของภาพที่อัปโหลดใหม่
 *       404:
 *         description: ไม่พบผู้ใช้ที่ตรงกับ ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
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
router.put('/profile', authenticateUser, profileUpload.single('imageProfile'), updateProfile)

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update user information
 *     description: อัปเดตข้อมูลผู้ใช้ เช่น username, email, role, name, age, tel, address, และ password
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของผู้ใช้ที่ต้องการอัปเดตข้อมูล
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               tel:
 *                 type: string
 *               address:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ["admin", "inspector", "supervisor"]
 *               department:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: ข้อมูลผู้ใช้ถูกอัปเดตสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 active:
 *                   type: boolean
 *                 profile:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     age:
 *                       type: integer
 *                     tel:
 *                       type: string
 *                     address:
 *                       type: string
 *                     image:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         path:
 *                           type: string
 *       403:
 *         description: "Access Denied: You must be the owner of this account or an admin"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access Denied: You must be the owner of this account or an admin"
 *       404:
 *         description: ไม่พบผู้ใช้ที่ตรงกับ ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
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
router.put('/user/:id', authenticateUser, updateUser)

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Deactivate user account
 *     description: ปิดการใช้งานบัญชีผู้ใช้โดยการอัปเดตสถานะ `active` เป็น `false`
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของผู้ใช้ที่ต้องการปิดการใช้งาน
 *     responses:
 *       200:
 *         description: User has been deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User has been deactivated successfully"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
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
router.delete('/user/:id', authenticateUser, authorized(['admin']), removeUser)

export default router
