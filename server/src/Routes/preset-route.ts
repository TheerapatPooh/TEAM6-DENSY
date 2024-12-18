import { getPreset, getAllPresets, createPreset, updatePreset, getAllChecklists, getChecklist, createChecklist, removeChecklist, removePreset, updateChecklist } from "@Controllers/preset-controller.js";
import { Router } from 'express'
import { authenticateUser } from "@Controllers/util-controller.js";
const router = Router()


router.get('/preset/:id', authenticateUser, getPreset)
router.get('/presets', authenticateUser, getAllPresets)
router.post('/preset', authenticateUser, createPreset)
router.post('/preset/:id', authenticateUser, updatePreset)
router.delete('/preset/:id', authenticateUser, removePreset);

router.get('/checklists', authenticateUser, authorzied(['admin', 'inspector']), getAllChecklists)
router.get('/checklist/:id', authenticateUser, authorzied(['admin', 'inspector']), getChecklist)
router.post('/checklist', authenticateUser, authorzied(['admin']), createChecklist)
router.put('/checklist/:id', authenticateUser, authorzied(['admin']), updateChecklist)
router.delete('/checklist/:id', authenticateUser, authorzied(['admin']), removeChecklist)

export default router
