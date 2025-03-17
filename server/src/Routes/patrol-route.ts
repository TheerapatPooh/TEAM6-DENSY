/**
 * คำอธิบาย:
 * ไฟล์นี้ใช้ในการกำหนดเส้นทาง (routes) สำหรับฟังก์ชันต่างๆ ที่เกี่ยวข้องกับการจัดการข้อมูล patrol เช่น การดึงข้อมูล patrol, การสร้าง patrol, การเริ่มต้นและเสร็จสิ้น patrol, การคอมเมนต์หรืออัปเดตสถานะของ patrol, การจัดการผู้ใช้งานใน patrol, และการดึงข้อมูล defect ที่เกี่ยวข้องกับ patrol
 * เส้นทางเหล่านี้จะถูกใช้งานผ่าน Express router
 * 
 * Input:
 * - ข้อมูลจาก body หรือ URL parameters (เช่น ข้อมูลของ patrol, ข้อมูลของ defect หรือ comment ที่เกี่ยวข้องกับ patrol, หรือ ID ของ patrol ที่ต้องการดำเนินการ)
 * 
 * Output:
 * - ส่งคืนคำตอบจาก API เช่น ข้อความสำเร็จ, ข้อความผิดพลาด, หรือข้อมูลเกี่ยวกับ patrol และ defect ที่ดึงจากฐานข้อมูล
**/
import { getAllPatrols, getPatrol, createPatrol, startPatrol, finishPatrol, removePatrol, commentPatrol, schedulePatrolStatusUpdate, getAllPatrolDefects, getPatrolUsers } from "@Controllers/patrol-controller.js";
import { Router } from 'express'
import { authenticateUser, authorized } from "@Controllers/util-controller.js";
const router = Router()

/**
 * @swagger
 * /api/patrol/{id}/defects:
 *   get:
 *     summary: Get all defects for a patrol
 *     description: ดึงข้อมูลทั้งหมดของ Defects สำหรับ Patrol ที่กำหนดโดยใช้ `patrolId`
 *     tags:
 *       - Patrol Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Patrol ที่ต้องการดึงข้อมูล Defects
 *     responses:
 *       200:
 *         description: รายการ Defects ที่พบสำหรับ Patrol ที่กำหนด
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         path:
 *                           type: string
 *                         user:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             email:
 *                               type: string
 *                             role:
 *                               type: string
 *                   patrolResult:
 *                     type: object
 *                     properties:
 *                       zoneId:
 *                         type: integer
 *                       itemZone:
 *                         type: object
 *                         properties:
 *                           zone:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               supervisor:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                   profile:
 *                                     type: object
 *                                     properties:
 *                                       name:
 *                                         type: string
 *       403:
 *         description: Unauthorized - You are not associated with this Patrol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are not associated with this Patrol"
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
 * 
 * /api/defects:
 *   get:
 *     summary: Get all defects for the logged-in user
 *     description: ดึงข้อมูลทั้งหมดของ Defects สำหรับผู้ใช้ที่ล็อกอิน
 *     responses:
 *       200:
 *         description: รายการ Defects ที่พบสำหรับผู้ใช้ที่ล็อกอิน
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         path:
 *                           type: string
 *                         user:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             email:
 *                               type: string
 *                             role:
 *                               type: string
 *                   patrolResult:
 *                     type: object
 *                     properties:
 *                       zoneId:
 *                         type: integer
 *                       itemZone:
 *                         type: object
 *                         properties:
 *                           zone:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               supervisor:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                   profile:
 *                                     type: object
 *                                     properties:
 *                                       name:
 *                                         type: string
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
router.get('/patrol/:id?/defects', authenticateUser, authorized(['admin', 'inspector']), getAllPatrolDefects)

/**
 * @swagger
 * /api/patrol/{id}:
 *   get:
 *     summary: Get patrol details by ID
 *     description: ดึงข้อมูล Patrol โดยใช้ ID พร้อมตัวเลือกการรวมข้อมูล preset และ result
 *     tags:
 *       - Patrol Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Patrol ที่ต้องการดึงข้อมูล
 *       - in: query
 *         name: preset
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: ตัวเลือกว่าจะรวมข้อมูล Preset หรือไม่
 *       - in: query
 *         name: result
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: ตัวเลือกว่าจะรวมข้อมูล Result หรือไม่
 *     responses:
 *       200:
 *         description: รายละเอียดของ Patrol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 patrolChecklists:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       checklist:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           items:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 zone:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: integer
 *                                     name:
 *                                       type: string
 *                                     supervisor:
 *                                       type: object
 *                                       properties:
 *                                         id:
 *                                           type: integer
 *                                         profile:
 *                                           type: object
 *                                           properties:
 *                                             name:
 *                                               type: string
 *                       inspector:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           email:
 *                             type: string
 *                           department:
 *                             type: string
 *                           role:
 *                             type: string
 *                           profile:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               image:
 *                                 type: string
 *                 preset:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       defects:
 *                         type: array
 *                         items:
 *                           type: object
 *                       comments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             user:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                 email:
 *                                   type: string
 *                                 department:
 *                                   type: string
 *                                 role:
 *                                   type: string
 *                                 profile:
 *                                   type: object
 *                                   properties:
 *                                     name:
 *                                       type: string
 *                                     image:
 *                                       type: string
 *       404:
 *         description: Patrol not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Patrol not found"
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
router.get('/patrol/:id', authenticateUser, authorized(['admin', 'inspector']), getPatrol)

/**
 * @swagger
 * /api/patrols:
 *   get:
 *     summary: Get all patrols
 *     description: ดึงข้อมูลทั้งหมดของ Patrol โดยสามารถกรองตามสถานะ, preset, ช่วงเวลา, และคำค้นหา
 *     tags:
 *       - Patrol Controller
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: กรอง Patrol ตามสถานะ เช่น "pending", "scheduled", "on_going", "completed"
 *       - in: query
 *         name: preset
 *         schema:
 *           type: string
 *         description: กรอง Patrol ตามชื่อ preset
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: วันที่เริ่มต้นของช่วงเวลา (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: วันที่สิ้นสุดของช่วงเวลา (YYYY-MM-DD)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: ค้นหาผ่านชื่อ preset หรือชื่อของ inspector
 *     responses:
 *       200:
 *         description: รายการของ Patrol ที่กรองข้อมูลแล้ว
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                   preset:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                   itemCounts:
 *                     type: integer
 *                   inspectors:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         profile:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             image:
 *                               type: string
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
router.get('/patrols', authenticateUser, authorized(['admin', 'inspector']), getAllPatrols)

/**
 * @swagger
 * /api/patrol:
 *   post:
 *     summary: Create a new patrol
 *     description: สร้างข้อมูล Patrol ใหม่พร้อมตรวจสอบ checklist และส่งการแจ้งเตือนให้กับผู้ตรวจสอบ
 *     tags:
 *       - Patrol Controller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: วันที่ของ Patrol
 *               presetId:
 *                 type: integer
 *                 description: ID ของ preset ที่ใช้
 *               checklists:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     checklistId:
 *                       type: integer
 *                       description: ID ของ checklist
 *                     userId:
 *                       type: integer
 *                       description: ID ของผู้ตรวจสอบ (inspector)
 *     responses:
 *       201:
 *         description: Patrol created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                 preset:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                 itemCounts:
 *                   type: integer
 *                 inspectors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       email:
 *                         type: string
 *                       profile:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           image:
 *                             type: string
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
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
router.post('/patrol', authenticateUser, authorized(['admin', 'inspector']), createPatrol)

/**
 * @swagger
 * /api/patrol/{id}/start:
 *   put:
 *     summary: Start a patrol
 *     description: เริ่มต้น Patrol และอัปเดตสถานะจาก "scheduled" เป็น "on_going"
 *     tags:
 *       - Patrol Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Patrol ที่ต้องการเริ่ม
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, on_going]
 *               checklists:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     checklistId:
 *                       type: integer
 *                     inspector:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *     responses:
 *       200:
 *         description: Patrol started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                 preset:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                 patrolChecklists:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       checklist:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                       inspector:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           email:
 *                             type: string
 *                           department:
 *                             type: string
 *                           role:
 *                             type: string
 *                           profile:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               image:
 *                                 type: string
 *       400:
 *         description: Missing required fields or invalid status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       403:
 *         description: Unauthorized - You are not authorized to start this patrol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to start this patrol. Only assigned inspectors can start the patrol."
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
router.put('/patrol/:id/start', authenticateUser, authorized(['admin', 'inspector']), startPatrol)

/**
 * @swagger
 * /api/patrol/{id}/finish:
 *   put:
 *     summary: Finish a patrol
 *     description: เปลี่ยนสถานะของ Patrol จาก "on_going" เป็น "completed" และอัปเดตข้อมูลที่เกี่ยวข้อง
 *     tags:
 *       - Patrol Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Patrol ที่ต้องการเสร็จสิ้น
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [on_going, completed]
 *               checklists:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     checklistId:
 *                       type: integer
 *                     inspector:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *               results:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [pending, resolved, completed]
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: เวลาเริ่มต้นของการตรวจสอบ
 *     responses:
 *       200:
 *         description: Patrol finished successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                 preset:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                 patrolChecklists:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       checklist:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                       inspector:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           email:
 *                             type: string
 *                           department:
 *                             type: string
 *                           role:
 *                             type: string
 *                           profile:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               image:
 *                                 type: string
 *       400:
 *         description: Invalid data or status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Data"
 *       403:
 *         description: Unauthorized - User is not authorized to finish this patrol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to finish this patrol. Only assigned inspectors can start the patrol."
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
router.put('/patrol/:id/finish', authenticateUser, authorized(['admin', 'inspector']), finishPatrol)

/**
 * @swagger
 * /api/patrol/{id}:
 *   delete:
 *     summary: Delete a patrol and related records
 *     description: ลบข้อมูล Patrol พร้อมข้อมูลที่เกี่ยวข้อง (เช่น PatrolChecklist, PatrolResult)
 *     tags:
 *       - Patrol Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Patrol ที่ต้องการลบ
 *     responses:
 *       200:
 *         description: Patrol and related records successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Patrol and related records successfully deleted"
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
router.delete('/patrol/:id', authenticateUser, authorized(['admin', 'inspector']), removePatrol)

/**
 * @swagger
 * /api/patrol/{id}/comment:
 *   post:
 *     summary: Add a comment to a patrol
 *     description: เพิ่มความคิดเห็นให้กับ Patrol โดยเชื่อมโยงกับ `patrolResult` และบันทึกข้อความ
 *     tags:
 *       - Patrol Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Patrol ที่ต้องการเพิ่มความคิดเห็น
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: ข้อความความคิดเห็นที่ต้องการเพิ่ม
 *               patrolResultId:
 *                 type: integer
 *                 description: ID ของ PatrolResult ที่ความคิดเห็นนี้จะถูกเชื่อมโยง
 *               supervisorId:
 *                 type: integer
 *                 description: ID ของ SupervisorId ที่เป็นผู้รับผิดชอบใน Zone ที่ถูก Comment
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad Request: Missing required fields"
 *       403:
 *         description: Unauthorized - User is not authorized to comment on this patrol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Patrol or checklist not found"
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
router.post('/patrol/:id/comment', authenticateUser, authorized(['admin', 'inspector']), commentPatrol);

/**
 * @swagger
 * /api/patrol/{id}/users:
 *   get:
 *     summary: Get patrol users by patrol ID
 *     description: ดึงข้อมูลผู้ใช้ (inspectors) ที่เกี่ยวข้องกับ Patrol โดยใช้ `patrolId`
 *     tags:
 *       - Patrol Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Patrol ที่ต้องการดึงข้อมูลผู้ใช้
 *     responses:
 *       200:
 *         description: รายการผู้ใช้ (Inspectors) ที่เกี่ยวข้องกับ Patrol
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
 *                   profile:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       image:
 *                         type: string
 *       404:
 *         description: Patrol not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Patrol not found"
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
router.get('/patrol/:id/user', authenticateUser, authorized(['admin', 'inspector']), getPatrolUsers)

schedulePatrolStatusUpdate();

export default router
