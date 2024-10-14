import { Router } from 'express'
import { getZone } from "../Controllers/location-controller";
import { authenticateUser } from "../Controllers/util-controller";
const router = Router()

router.get('/zone/:id', authenticateUser, getZone)

module.exports = router