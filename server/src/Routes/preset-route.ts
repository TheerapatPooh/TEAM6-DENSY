import { getPreset, getAllPresets } from "@Controllers/preset-controller.js";
import { Router } from 'express'
import { authenticateUser } from "@Controllers/util-controller.js";
const router = Router()


router.get('/preset/:id', authenticateUser, getPreset)
router.get('/presets', authenticateUser, getAllPresets)

export default router
