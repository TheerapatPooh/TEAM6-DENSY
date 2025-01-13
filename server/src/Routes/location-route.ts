import { Router } from 'express'
import { getAllZone, getLocation, getZone, updateSupervisor } from "@Controllers/location-controller.js";
import { authenticateUser, authorzied } from "@Controllers/util-controller.js";
const router = Router()

router.get('/zones', authenticateUser, getAllZone)
router.get('/zone/:id', authenticateUser, getZone)
router.get('/location/:id', authenticateUser, getLocation)
router.put('/zone/:id', authenticateUser, authorzied(['admin']), updateSupervisor)

export default router
