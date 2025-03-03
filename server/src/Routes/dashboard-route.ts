import { Router } from 'express'
import { authenticateUser, authorized } from "@Controllers/util-controller.js";
import { getCommonDefects, getDefectCategory, getHeatMap, getPatrolCompletionRate, getDefectReported } from '@Controllers/dashboard-controller.js';

const router = Router()

/**
 * @swagger
 * /api/dashboard/heat-map:
 *   get:
 *     summary: Get heat map data
 *     description: ดึงข้อมูล Heat Map โดยสามารถกรองข้อมูลได้ตามช่วงเวลา
 *     parameters:
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
 *     responses:
 *       200:
 *         description: ข้อมูล Heat Map ของแต่ละโซน
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
 *                   defects:
 *                     type: integer
 *                     description: จำนวน defects ในแต่ละโซน
 *       404:
 *         description: ไม่พบข้อมูลโซน
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get('/dashboard/heat-map', authenticateUser, authorized(['admin']), getHeatMap)

/**
 * @swagger
 * /api/dashboard/defect-category:
 *   get:
 *     summary: Get defect category data
 *     description: ดึงข้อมูลประเภทของ defects โดยสามารถกรองข้อมูลได้ตาม patrolId, zoneId, และช่วงเวลา
 *     parameters:
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
 *         name: patrolId
 *         schema:
 *           type: integer
 *         description: ID ของ Patrol ที่ต้องการกรอง
 *       - in: query
 *         name: zoneId
 *         schema:
 *           type: integer
 *         description: ID ของ Zone ที่ต้องการกรอง
 *     responses:
 *       200:
 *         description: ข้อมูล defect category และ trend
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chartData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                       amounts:
 *                         type: integer
 *                       fill:
 *                         type: string
 *                 trend:
 *                   type: number
 *                   description: เปอร์เซ็นต์การเปลี่ยนแปลงของ defects จากเดือนที่แล้ว
 *       404:
 *         description: ไม่พบข้อมูล defect
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get('/dashboard/defect-category', authenticateUser, authorized(['admin']), getDefectCategory)

/**
 * @swagger
 * /api/dashboard/common-defects:
 *   get:
 *     summary: Get common defects data
 *     description: ดึงข้อมูล defects ที่เกิดขึ้นบ่อยที่สุด โดยสามารถกรองข้อมูลได้ตามช่วงเวลาและ zoneId
 *     parameters:
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
 *         name: zoneId
 *         schema:
 *           type: integer
 *         description: ID ของ Zone ที่ต้องการกรอง
 *     responses:
 *       200:
 *         description: รายการ defects ที่พบมากที่สุด
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   amounts:
 *                     type: integer
 *                   fill:
 *                     type: string
 *       404:
 *         description: ไม่พบข้อมูล defect
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get('/dashboard/common-defects', authenticateUser, authorized(['admin']), getCommonDefects)

/**
 * @swagger
 * /api/dashboard/patrol-completion:
 *   get:
 *     summary: Get patrol completion rate
 *     description: คำนวณอัตราการทำงานของ patrol โดยแยกตามว่ามี defects หรือไม่ และคำนวณเทรนด์ระหว่างเดือนปัจจุบันและเดือนก่อนหน้า
 *     parameters:
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
 *     responses:
 *       200:
 *         description: ข้อมูลอัตราการทำงานของ patrol และเทรนด์ของอัตราการทำงาน
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chartData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       noDefect:
 *                         type: integer
 *                       withDefect:
 *                         type: integer
 *                 percent:
 *                   type: number
 *                   format: float
 *                 trend:
 *                   type: string
 *       404:
 *         description: ไม่พบข้อมูล patrol
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get('/dashboard/patrol-completion', authenticateUser, authorized(['admin']), getPatrolCompletionRate)

/**
 * @swagger
 * /api/dashboard/overview/{id}:
 *   get:
 *     summary: Get defects reported for a specific patrol
 *     description: ดึงข้อมูล defects ที่รายงานจาก patrol ที่ระบุ พร้อมข้อมูลของ zone ที่เกี่ยวข้อง
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ patrol
 *     responses:
 *       200:
 *         description: รายละเอียดของ defects ที่รายงานใน patrol พร้อมข้อมูลของ zone ที่เกี่ยวข้อง
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
 *                   type:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       role:
 *                         type: string
 *                       profile:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           tel:
 *                             type: string
 *                           name:
 *                             type: string
 *                           image:
 *                             type: object
 *                             properties:
 *                               path:
 *                                 type: string
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                   zone:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       404:
 *         description: ไม่พบข้อมูล patrol
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get('/dashboard/overview/:id', authenticateUser, authorized(['admin']), getDefectReported)

export default router
