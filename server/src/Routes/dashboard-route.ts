import { Router } from 'express'
import { authenticateUser, authorzied } from "@Controllers/util-controller.js";
import { getCommonDefects, getDefectCatagory, getHeatMap, getPatrolCompletionRate } from '@Controllers/dashboard-controller.js';

const router = Router()
router.get('/dashboard/heat-map', authenticateUser, authorzied(['admin']), getHeatMap)
router.get('/dashboard/defect-catagory', authenticateUser, authorzied(['admin']), getDefectCatagory)
router.get('/dashboard/common-defects', authenticateUser, authorzied(['admin']), getCommonDefects)
router.get('/dashboard/patrol-completion', authenticateUser, authorzied(['admin']), getPatrolCompletionRate)

export default router
