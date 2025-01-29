import { createDefect, getDefect, getAllDefects, deleteDefect, updateDefect, getAllComments, confirmComment } from "@Controllers/defect-controller.js";
import { Router } from 'express'
import { authenticateUser, authorzied, upload } from "@Controllers/util-controller.js";

const router = Router()

/**
 * @swagger
 * /api/defect:
 *   post:
 *     summary: Create defect report
 *     description: สร้าง Defect ใหม่
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               defectUserId:
 *                 type: string
 *               imageFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Defect created
 */
router.post('/defect', (req, res, next) => {
  next();
}, upload.array('imageFiles', 10), authenticateUser, authorzied(['admin', 'inspector']), createDefect);


router.get('/defect/:id', authenticateUser, authorzied(['admin', 'supervisor']), getDefect)

/**
 * @swagger
 * /api/defects:
 *   get:
 *     summary: Get all defect reports
 *     description: ดึงข้อมูลรายงานปัญหาทั้งหมด
 *     responses:
 *       200:
 *         description: Defects found
 */
router.get('/defects', authenticateUser, authorzied(['admin', 'supervisor']), getAllDefects)
router.put('/defect/:id', upload.array('imageFiles', 10), authenticateUser, authorzied(['admin', 'inspector', 'supervisor']), updateDefect);
router.delete('/defect/:id', authenticateUser, authorzied(['admin', 'inspector']), deleteDefect)
router.get('/comments', authenticateUser, authorzied(['admin', 'supervisor']), getAllComments)
router.put('/comment/:id', authenticateUser, authorzied(['admin', 'supervisor']), confirmComment)

export default router
