import { getPreset, getAllPresets,createPreset,updatePreset, getAllChecklists, getChecklist, createChecklist, removeChecklist } from "@Controllers/preset-controller.js";
import { Router } from 'express'
import { authenticateUser } from "@Controllers/util-controller.js";
const router = Router()


router.get('/preset/:id', authenticateUser, getPreset)
router.get('/presets', authenticateUser, getAllPresets)
router.post('/preset', authenticateUser, createPreset)
router.post('/preset/:id', authenticateUser, updatePreset)

router.get('/checklists', authenticateUser, getAllChecklists)
router.get('/checklist/:id', authenticateUser, getChecklist)
router.post('/checklist', authenticateUser, createChecklist)
router.put('/checklist/:id', authenticateUser, removeChecklist)

export default router
