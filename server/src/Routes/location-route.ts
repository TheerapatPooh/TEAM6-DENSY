/**
 * คำอธิบาย:
 * ไฟล์นี้ใช้ในการกำหนดเส้นทาง (routes) ที่เกี่ยวข้องกับการจัดการข้อมูลที่เกี่ยวข้องกับ zones และ locations รวมถึงการอัปเดตข้อมูล supervisor ที่เกี่ยวข้องกับ zone
 * เส้นทางเหล่านี้จะถูกใช้งานผ่าน Express router
 * 
 * Input:
 * - ข้อมูลจาก body หรือ URL parameters เช่น ข้อมูลของ location หรือ zone ที่ต้องการดึงหรืออัปเดต
 * 
 * Output:
 * - ส่งคืนข้อมูลที่เกี่ยวข้องกับ zones, location หรือข้อความผลการดำเนินการ เช่น ข้อความสำเร็จ, ข้อความผิดพลาด หรือข้อมูลที่ดึงมาจากฐานข้อมูล
**/
import { Router } from 'express'
import { getAllZones, getLocation, getZone, updateSupervisor } from "@Controllers/location-controller.js";
import { authenticateUser, authorized } from "@Controllers/util-controller.js";
const router = Router()

/**
 * @swagger
 * /api/zone/{id}:
 *   get:
 *     summary: Get zone details by ID
 *     description: ดึงข้อมูล Zone และ Supervisor ที่เกี่ยวข้อง
 *     tags:
 *       - Location Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Zone ที่ต้องการดึงข้อมูล
 *     responses:
 *       200:
 *         description: รายละเอียดของ Zone และ Supervisor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 supervisor:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     department:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     profile:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         image:
 *                           type: string
 *       404:
 *         description: Zone not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Zone not found"
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
router.get('/zone/:id', authenticateUser, getZone)

/**
 * @swagger
 * /api/zones:
 *   get:
 *     summary: Get all zones
 *     description: ดึงข้อมูลทั้งหมดของ Zone
 *     tags:
 *       - Location Controller
 *     responses:
 *       200:
 *         description: รายการ Zones ที่พบ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       404:
 *         description: No zones found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No zones found"
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
router.get('/zones', authenticateUser, getAllZones)

/**
 * @swagger
 * /api/location/{id}:
 *   get:
 *     summary: Get location details by ID
 *     description: ดึงข้อมูล Location และ Zones ที่เกี่ยวข้อง พร้อมข้อมูล Supervisor
 *     tags:
 *       - Location Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Location ที่ต้องการดึงข้อมูล
 *     responses:
 *       200:
 *         description: รายละเอียดของ Location พร้อม Zones และ Supervisor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 zones:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       supervisor:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           username:
 *                             type: string
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *                           department:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           profile:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                               image:
 *                                 type: string
 *       404:
 *         description: Location not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Location not found"
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
router.get('/location/:id', authenticateUser, getLocation)

/**
 * @swagger
 * /api/zone/{id}:
 *   put:
 *     summary: Update supervisor for a zone
 *     description: อัปเดตข้อมูลของ Supervisor สำหรับ Zone ที่เลือก โดยการเชื่อมโยง `userId` กับ `zone`
 *     tags:
 *       - Location Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Zone ที่ต้องการอัปเดต Supervisor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID ของผู้ใช้งาน (Supervisor) ที่จะเชื่อมโยงกับ Zone
 *     responses:
 *       200:
 *         description: Supervisor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 supervisor:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     department:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     profile:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         image:
 *                           type: string
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid userId or zoneId"
 *       404:
 *         description: Zone or Supervisor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Zone or Supervisor not found"
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
router.put('/zone/:id', authenticateUser, authorized(['admin']), updateSupervisor)

export default router
