import { Router } from 'express'
import { authenticateUser, authorzied } from "@Controllers/util-controller.js";
import { getCommonDefects, getDefectCategory, getDefectReported, getHeatMap, getPatrolCompletionRate } from '@Controllers/dashboard-controller.js';

const router = Router()
router.get('/dashboard/heat-map', authenticateUser, authorzied(['admin']), getHeatMap)
router.get('/dashboard/defect-category', authenticateUser, authorzied(['admin']), getDefectCategory)
router.get('/dashboard/common-defects', authenticateUser, authorzied(['admin']), getCommonDefects)
router.get('/dashboard/patrol-completion', authenticateUser, authorzied(['admin']), getPatrolCompletionRate)
router.get('/dashboard/overview/:id', authenticateUser, authorzied(['admin']), getDefectReported)

export default router
