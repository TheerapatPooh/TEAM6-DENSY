import { createDefect, getDefect, getAllDefects, deleteDefect, updateDefect, getAllComments, confirmComment } from "@Controllers/defect-controller.js";
import { Router } from 'express'
import { authenticateUser, authorized, defectUpload, uploadDefectImages } from "@Controllers/util-controller.js";

const router = Router()

/**
 * @swagger
 * /api/defect/{id}:
 *   get:
 *     summary: Get defect details by ID
 *     description: ดึงรายละเอียดของ Defect ตาม ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Defect ที่ต้องการดึงข้อมูล
 *     responses:
 *       200:
 *         description: รายละเอียดของ Defect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 type:
 *                   type: string
 *                 status:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       path:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                 patrolResult:
 *                   type: object
 *                   properties:
 *                     itemZone:
 *                       type: object
 *                       properties:
 *                         zone:
 *                           type: object
 *                           properties:
 *                             supervisor:
 *                               type: object
 *                               properties:
 *                                 profile:
 *                                   type: object
 *       404:
 *         description: ไม่พบ Defect
 *       500:
 *         description: เกิดข้อผิดพลาดในเซิร์ฟเวอร์
 */
router.get('/defect/:id', authenticateUser, authorized(['admin', 'supervisor']), getDefect)

/**
 * @swagger
 * /api/defects:
 *   get:
 *     summary: Get all defects
 *     description: ดึงข้อมูล Defect ทั้งหมดโดยสามารถกรองข้อมูลได้ตามเงื่อนไข
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: กรอง Defect ตามสถานะ (e.g., "reported", "in_progress")
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: กรองตามประเภทของ Defect (e.g., "safety", "maintenance")
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: วันที่เริ่มต้น (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: วันที่สิ้นสุด (YYYY-MM-DD)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: ค้นหาด้วยชื่อ Defect, ชื่อ User, หรือ ID
 *     responses:
 *       200:
 *         description: รายการ Defects ที่พบ
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
 *                   description:
 *                     type: string
 *                   type:
 *                     type: string
 *                   status:
 *                     type: string
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       profile:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           tel:
 *                             type: string
 *                           image:
 *                             type: string
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
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                             profile:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                 name:
 *                                   type: string
 *                                 tel:
 *                                   type: string
 *                                 image:
 *                                   type: string
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get('/defects', authenticateUser, authorized(['admin', 'supervisor']), getAllDefects)

/**
 * @swagger
 * /api/defect:
 *   post:
 *     summary: Create defect report
 *     description: สร้าง Defect ใหม่พร้อมอัปโหลดภาพ
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: ชื่อของ Defect
 *               description:
 *                 type: string
 *                 description: รายละเอียดของ Defect
 *               type:
 *                 type: string
 *                 description: ประเภทของ Defect
 *               defectUserId:
 *                 type: string
 *                 description: ID ของผู้แจ้ง Defect
 *               patrolResultId:
 *                 type: string
 *                 description: ID ของ Patrol Result ที่เกี่ยวข้อง
 *               supervisorId:
 *                 type: string
 *                 description: ID ของ Supervisor ที่เกี่ยวข้อง
 *               imageFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: ไฟล์รูปภาพที่เกี่ยวข้องกับ Defect (สูงสุด 10 ไฟล์)
 *     responses:
 *       201:
 *         description: Defect created successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Patrol result not found
 *       500:
 *         description: Internal server error
 */
router.post('/defect', (req, res, next) => {
  next();
}, upload.array('imageFiles', 10), authenticateUser, authorized(['admin', 'inspector']), createDefect);

/**
 * @swagger
 * /api/defect/{id}:
 *   put:
 *     summary: Update defect report
 *     description: อัปเดตข้อมูลของ Defect ตาม ID และสามารถอัปโหลดรูปภาพใหม่ได้
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Defect ที่ต้องการอัปเดต
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: ชื่อของ Defect
 *               description:
 *                 type: string
 *                 description: รายละเอียดของ Defect
 *               type:
 *                 type: string
 *                 description: ประเภทของ Defect
 *               status:
 *                 type: string
 *                 enum: [reported, in_progress, pending_inspection, resolved, completed]
 *                 description: สถานะของ Defect
 *               defectUserId:
 *                 type: string
 *                 description: ID ของผู้แจ้ง Defect
 *               supervisorId:
 *                 type: string
 *                 description: ID ของ Supervisor ที่เกี่ยวข้อง
 *               patrolResultId:
 *                 type: string
 *                 description: ID ของ Patrol Result ที่เกี่ยวข้อง
 *               deleteExistingImages:
 *                 type: boolean
 *                 description: หากเป็น `true` ระบบจะลบภาพที่มีอยู่เดิม
 *               imageFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: ไฟล์รูปภาพใหม่ (อัปโหลดได้สูงสุด 10 ไฟล์)
 *     responses:
 *       200:
 *         description: Defect updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 type:
 *                   type: string
 *                 status:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       path:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                 patrolResult:
 *                   type: object
 *                   properties:
 *                     itemZone:
 *                       type: object
 *                       properties:
 *                         zone:
 *                           type: object
 *                           properties:
 *                             supervisor:
 *                               type: object
 *                               properties:
 *                                 profile:
 *                                   type: object
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Defect not found
 *       500:
 *         description: Internal server error
 */
router.put('/defect/:id', upload.array('imageFiles', 10), authenticateUser, authorized(['admin', 'inspector', 'supervisor']), updateDefect);

/**
 * @swagger
 * /api/defect/{id}:
 *   delete:
 *     summary: Delete a defect report
 *     description: ลบ Defect ตาม ID และลบไฟล์รูปภาพที่เกี่ยวข้อง
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Defect ที่ต้องการลบ
 *     responses:
 *       200:
 *         description: Defect deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Defect deleted successfully"
 *       403:
 *         description: Unauthorized - User does not have permission to delete this defect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to delete this defect"
 *       404:
 *         description: Defect not found หรือไม่มีสิทธิ์ลบ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Defect not found"
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
router.delete('/defect/:id', authenticateUser, authorized(['admin', 'inspector']), deleteDefect)

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments
 *     description: ดึงข้อมูล Comment ทั้งหมดโดยสามารถกรองข้อมูลได้ตามเงื่อนไข
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: กรอง Comment ตามสถานะ (`true` = Completed, `false` = Pending)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: วันที่เริ่มต้นของช่วงเวลาที่ต้องการกรอง (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: วันที่สิ้นสุดของช่วงเวลาที่ต้องการกรอง (YYYY-MM-DD)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: ค้นหาผ่านข้อความของ Comment, ชื่อ Zone หรือ Item
 *     responses:
 *       200:
 *         description: รายการ Comments ที่พบ
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
 *                   status:
 *                     type: boolean
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       profile:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           tel:
 *                             type: string
 *                           image:
 *                             type: string
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
 *                           item:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               checklist:
 *                                 type: object
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
router.get('/comments', authenticateUser, authorized(['admin', 'supervisor']), getAllComments)

/**
 * @swagger
 * /api/comment/{id}:
 *   put:
 *     summary: Confirm a comment
 *     description: เปลี่ยนสถานะของ Comment เป็น Confirmed (`status = true`)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Comment ที่ต้องการยืนยัน
 *     responses:
 *       200:
 *         description: Comment confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
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
 *                         tel:
 *                           type: string
 *                         image:
 *                           type: string
 *                 patrolResult:
 *                   type: object
 *                   properties:
 *                     zoneId:
 *                       type: integer
 *                     itemZone:
 *                       type: object
 *                       properties:
 *                         zone:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                         item:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             checklist:
 *                               type: object
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment not found"
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
router.put('/comment/:id', authenticateUser, authorized(['admin', 'supervisor']), confirmComment)

router.put(
  '/defect/:id/upload',
  authenticateUser,
  authorized(['admin', 'inspector']),
  defectUpload.array('imageFiles', 10), // Multer middleware here
  uploadDefectImages
);

export default router
