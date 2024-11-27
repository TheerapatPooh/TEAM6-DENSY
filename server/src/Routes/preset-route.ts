import { getPreset, getAllPresets,createPreset,updatePreset } from "@Controllers/preset-controller.js";
import { Router } from 'express'
import { authenticateUser } from "@Controllers/util-controller.js";
const router = Router()


router.get('/preset/:id', authenticateUser, getPreset)
router.get('/presets', authenticateUser, getAllPresets)
router.post('/preset', authenticateUser, createPreset)
router.post('/preset/:id', authenticateUser, updatePreset)

export default router
