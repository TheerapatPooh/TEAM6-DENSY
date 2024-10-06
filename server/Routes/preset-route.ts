import { getPreset, getAllPresets } from "../Controllers/preset-controller";
import { Router } from 'express'
import { authenticateUser } from "../Controllers/util-controller";
const router = Router()


router.get('/preset/:id', authenticateUser, getPreset)
router.get('/presets', authenticateUser, getAllPresets)


module.exports = router