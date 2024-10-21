import { Router } from 'express'
import { getLocation, getZone } from "../Controllers/location-controller";
import { authenticateUser } from "../Controllers/util-controller";
const router = Router()

router.get('/zone/:id', authenticateUser, getZone)
router.get('/location/:id', authenticateUser, getLocation)

module.exports = router