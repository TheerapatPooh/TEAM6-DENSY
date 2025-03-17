/**
 * คำอธิบาย:
 * ไฟล์นี้ใช้ในการกำหนดเส้นทาง (routes) สำหรับฟังก์ชันต่างๆ ที่เกี่ยวข้องกับการจัดการ preset และ checklist เช่น การสร้าง preset, การอัปเดต preset, การลบ preset, การดึงข้อมูล checklist และการอัปเดต checklist
 * เส้นทางเหล่านี้จะถูกใช้งานผ่าน Express router
 * 
 * Input:
 * - ข้อมูลจาก body หรือ URL parameters (เช่น ข้อมูล preset ที่ต้องการสร้างหรืออัปเดต, ID ของ checklist ที่ต้องการดึงหรืออัปเดต)
 * 
 * Output:
 * - ส่งคืนคำตอบจาก API เช่น ข้อความสำเร็จ, ข้อความผิดพลาด, หรือข้อมูล preset และ checklist ที่ดึงจากฐานข้อมูล
**/
import { getPreset, getAllPresets, createPreset, updatePreset, getAllChecklists, getChecklist, createChecklist, removeChecklist, removePreset, updateChecklist } from "@Controllers/preset-controller.js";
import { Router } from 'express'
import { authenticateUser, authorized } from "@Controllers/util-controller.js";
const router = Router()

/**
 * @swagger
 * /api/preset/{id}:
 *   get:
 *     summary: Get preset details by ID
 *     description: ดึงข้อมูลของ Preset โดยใช้ ID พร้อมข้อมูลที่เกี่ยวข้อง เช่น checklists, items และ zones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Preset ที่ต้องการดึงข้อมูล
 *     responses:
 *       200:
 *         description: รายละเอียดของ Preset พร้อมข้อมูลที่เกี่ยวข้อง
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 presetChecklists:
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
 *                                 id:
 *                                   type: integer
 *                                 title:
 *                                   type: string
 *                                 itemZones:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       zone:
 *                                         type: object
 *                                         properties:
 *                                           id:
 *                                             type: integer
 *                                           name:
 *                                             type: string
 *       404:
 *         description: Preset not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Preset not found"
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
router.get('/preset/:id', authenticateUser, authorized(['admin', 'inspector']), getPreset)

/**
 * @swagger
 * /api/presets:
 *   get:
 *     summary: Get all presets
 *     description: ดึงข้อมูลทั้งหมดของ Presets พร้อมข้อมูลที่เกี่ยวข้อง เช่น checklists, items และ zones
 *     parameters:
 *       - in: query
 *         name: latest
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: ตัวเลือกว่าจะกรองข้อมูลแค่ Preset ที่มีสถานะเป็น "latest" หรือไม่
 *     responses:
 *       200:
 *         description: รายการของ Presets พร้อมข้อมูลที่เกี่ยวข้อง
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   presetChecklists:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         checklist:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             title:
 *                               type: string
 *                             items:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                   title:
 *                                     type: string
 *                                   itemZones:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         zone:
 *                                           type: object
 *                                           properties:
 *                                             id:
 *                                               type: integer
 *                                             name:
 *                                               type: string
 *                   zones:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *       404:
 *         description: No presets found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No presets found"
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
router.get('/presets', authenticateUser, authorized(['admin', 'inspector']), getAllPresets)

/**
 * @swagger
 * /api/preset:
 *   post:
 *     summary: Create a new preset
 *     description: สร้าง Preset ใหม่พร้อมเชื่อมโยงกับ checklists ที่เลือก
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: ชื่อของ Preset
 *               description:
 *                 type: string
 *                 description: รายละเอียดของ Preset
 *               checklists:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: รายการของ checklist ที่จะเชื่อมโยงกับ preset
 *     responses:
 *       201:
 *         description: Preset created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Preset created successfully"
 *                 preset:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     version:
 *                       type: integer
 *                     latest:
 *                       type: boolean
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
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
router.post('/preset', authenticateUser, authorized(['admin']), createPreset)

/**
 * @swagger
 * /api/preset/{id}:
 *   put:
 *     summary: Update an existing preset
 *     description: อัปเดตข้อมูลของ Preset โดยเพิ่มเวอร์ชันใหม่ และทำให้ preset เก่าไม่ใช่เวอร์ชันล่าสุด
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Preset ที่ต้องการอัปเดต
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: ชื่อของ Preset
 *               description:
 *                 type: string
 *                 description: รายละเอียดของ Preset
 *               checklists:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: รายการของ checklist ที่จะเชื่อมโยงกับ preset
 *     responses:
 *       200:
 *         description: Preset updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Preset updated successfully"
 *                 preset:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     version:
 *                       type: integer
 *                     latest:
 *                       type: boolean
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       404:
 *         description: Preset not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Preset not found"
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
router.put('/preset/:id', authenticateUser, authorized(['admin']), updatePreset)

/**
 * @swagger
 * /api/preset/{id}:
 *   delete:
 *     summary: Remove a preset by ID
 *     description: ลบข้อมูลของ Preset โดยตรวจสอบว่าไม่มี Patrol ที่เชื่อมโยงกับ Preset นี้
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Preset ที่ต้องการลบ
 *     responses:
 *       200:
 *         description: Preset removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Preset removed successfully"
 *       400:
 *         description: Invalid Preset ID or Preset is linked to a Patrol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot delete Preset: Patrols are still linked to this Preset"
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
router.delete('/preset/:id', authenticateUser, authorized(['admin']), removePreset);

/**
 * @swagger
 * /api/checklists:
 *   get:
 *     summary: Get all checklists
 *     description: ดึงข้อมูลทั้งหมดของ Checklists พร้อมกรองตาม zones, startDate, endDate, และ title
 *     parameters:
 *       - in: query
 *         name: zones
 *         required: false
 *         schema:
 *           type: string
 *           description: รายชื่อ zones ที่ต้องการกรอง (คั่นด้วย comma)
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: วันที่เริ่มต้นสำหรับการกรอง
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: วันที่สิ้นสุดสำหรับการกรอง
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: คำที่ใช้ค้นหาใน title ของ checklist
 *     responses:
 *       200:
 *         description: รายการของ Checklists พร้อมข้อมูลที่เกี่ยวข้อง
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   version:
 *                     type: integer
 *                   latest:
 *                     type: boolean
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   updateBy:
 *                     type: integer
 *                   updateByUserName:
 *                     type: string
 *                   imagePath:
 *                     type: string
 *                   itemCounts:
 *                     type: object
 *                     additionalProperties:
 *                       type: integer
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                   zones:
 *                     type: array
 *                     items:
 *                       type: string
 *                   versionCount:
 *                     type: integer
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         type:
 *                           type: string
 *       404:
 *         description: No checklists found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No checklists found"
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
router.get('/checklists', authenticateUser, authorized(['admin', 'inspector']), getAllChecklists)

/**
 * @swagger
 * /api/checklist/{id}:
 *   get:
 *     summary: Get checklist details by ID
 *     description: ดึงข้อมูลของ Checklist โดยใช้ ID พร้อมข้อมูลที่เกี่ยวข้อง เช่น items, itemZones และ zone พร้อมข้อมูล supervisor (ถ้าระบุ query parameter `supervisor=true`)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Checklist ที่ต้องการดึงข้อมูล
 *       - in: query
 *         name: supervisor
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: ถ้าระบุเป็น `true` จะดึงข้อมูลของ supervisor ด้วย
 *     responses:
 *       200:
 *         description: รายละเอียดของ Checklist พร้อมข้อมูลที่เกี่ยวข้อง
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       itemZones:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             zone:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                 name:
 *                                   type: string
 *                                 supervisor:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: integer
 *                                     role:
 *                                       type: string
 *                                     profile:
 *                                       type: object
 *                                       properties:
 *                                         id:
 *                                           type: integer
 *                                         name:
 *                                           type: string
 *                                         age:
 *                                           type: integer
 *                                         tel:
 *                                           type: string
 *                                         address:
 *                                           type: string
 *       404:
 *         description: Checklist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Checklist not found"
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
router.get('/checklist/:id', authenticateUser, authorized(['admin', 'inspector']), getChecklist)

/**
 * @swagger
 * /api/checklist:
 *   post:
 *     summary: Create a new checklist
 *     description: สร้าง Checklist ใหม่และเพิ่ม items พร้อมเชื่อมโยงกับ zones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: ชื่อของ Checklist
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     zoneId:
 *                       type: array
 *                       items:
 *                         type: integer
 *                 description: รายการของ items ที่จะเพิ่มใน checklist พร้อม zoneId
 *     responses:
 *       201:
 *         description: Checklist created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Checklist created successfully"
 *                 checklist:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     version:
 *                       type: integer
 *                     latest:
 *                       type: boolean
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     updatedBy:
 *                       type: integer
 *       400:
 *         description: Missing required fields, empty items, or checklist with the same title already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required field title"
 *       404:
 *         description: Zone not found for provided Zone ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Zone ID 'X' not found"
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
router.post('/checklist', authenticateUser, authorized(['admin']), createChecklist)

/**
 * @swagger
 * /api/checklist/{id}:
 *   put:
 *     summary: Update an existing checklist
 *     description: อัปเดตข้อมูลของ Checklist โดยเพิ่มเวอร์ชันใหม่ และทำให้ checklist เก่าไม่ใช่เวอร์ชันล่าสุด
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Checklist ที่ต้องการอัปเดต
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: ชื่อของ Checklist
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     zoneId:
 *                       type: array
 *                       items:
 *                         type: integer
 *                 description: รายการของ items ที่จะเพิ่มใน checklist
 *     responses:
 *       201:
 *         description: Checklist updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Checklist update successfully"
 *                 checklists:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     version:
 *                       type: integer
 *                     latest:
 *                       type: boolean
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       404:
 *         description: Checklist or Zone not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Checklist not found"
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
router.put('/checklist/:id', authenticateUser, authorized(['admin']), updateChecklist)

/**
 * @swagger
 * /api/checklist/{id}:
 *   delete:
 *     summary: Deactivate a checklist by ID
 *     description: อัปเดตสถานะของ Checklist ให้เป็นไม่ใช่เวอร์ชันล่าสุด (deactivate) โดยไม่ลบข้อมูล
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Checklist ที่ต้องการ deactivate
 *     responses:
 *       200:
 *         description: Checklist deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Checklist has been deactivated successfully"
 *       404:
 *         description: Checklist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Checklist not found"
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
router.delete('/checklist/:id', authenticateUser, authorized(['admin']), removeChecklist)

export default router
