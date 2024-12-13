import { getPreset, getAllPresets,createPreset,updatePreset, getAllChecklists, getChecklist, removePreset } from "@Controllers/preset-controller.js";
import { Router } from 'express'
import { authenticateUser } from "@Controllers/util-controller.js";
const router = Router()


router.get('/preset/:id', authenticateUser, getPreset)
router.get('/presets', authenticateUser, getAllPresets)
router.post('/preset', authenticateUser, createPreset)
router.post('/preset/:id', authenticateUser, updatePreset)
router.delete('/preset/:id', authenticateUser, removePreset);

router.get('/checklists', authenticateUser, getAllChecklists)
router.get('/checklist/:id', authenticateUser, getChecklist)
export default router
