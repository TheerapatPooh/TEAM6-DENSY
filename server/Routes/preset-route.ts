import { getAllPresets } from "../Controllers/preset-controller";
import { Router } from 'express'
import { authenticateUser } from "../Controllers/util-controller";
const router = Router()


router.get('/preset', authenticateUser, getAllPresets)


module.exports = router