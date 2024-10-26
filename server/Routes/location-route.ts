import { Router } from 'express'
import { getAllZones, getZone } from "../Controllers/location-controller";
import { authenticateUser } from "../Controllers/util-controller";
const router = Router()

router.get('/zone/:id', authenticateUser, getZone)
router.get('/zones/', authenticateUser, getAllZones)

module.exports = router