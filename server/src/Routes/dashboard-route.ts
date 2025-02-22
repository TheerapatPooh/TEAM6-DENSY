import { Router } from 'express'
import { authenticateUser, authorized } from "@Controllers/util-controller.js";
import { getCommonDefects, getDefectCategory, getHeatMap, getPatrolCompletionRate, getDefectReported } from '@Controllers/dashboard-controller.js';

const router = Router()
router.get('/dashboard/heat-map', authenticateUser, authorized(['admin']), getHeatMap)
router.get('/dashboard/defect-category', authenticateUser, authorized(['admin']), getDefectCategory)
router.get('/dashboard/common-defects', authenticateUser, authorized(['admin']), getCommonDefects)
router.get('/dashboard/patrol-completion', authenticateUser, authorized(['admin']), getPatrolCompletionRate)
router.get('/dashboard/overview/:id', authenticateUser, authorized(['admin']), getDefectReported)

export default router
