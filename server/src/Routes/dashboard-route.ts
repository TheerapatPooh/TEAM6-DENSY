import { Router } from 'express'
import { authenticateUser, authorzied } from "@Controllers/util-controller.js";
import { getHeatMap } from '@Controllers/dashboard-controller.js';

const router = Router()
router.get('/dashboard/heat-map', authenticateUser, authorzied(['admin']), getHeatMap)

export default router
