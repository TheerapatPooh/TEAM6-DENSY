import { Router } from 'express'
import { getAllZones, getZone } from "@Controllers/location-controller.js";
import { authenticateUser } from "@Controllers/util-controller.js";
const router = Router()

router.get('/zone/:id', authenticateUser, getZone)
router.get('/zones/', authenticateUser, getAllZones)

export default router
