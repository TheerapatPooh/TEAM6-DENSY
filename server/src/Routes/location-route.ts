import { Router } from 'express'
import { getLocation, getZone } from "@Controllers/location-controller.js";
import { authenticateUser } from "@Controllers/util-controller.js";
const router = Router()

router.get('/zone/:id', authenticateUser, getZone)
router.get('/location/:id', authenticateUser, getLocation)

export default router
