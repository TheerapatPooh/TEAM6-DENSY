import { getPreset, getAllPresets, createPreset, updatePreset, getAllChecklists, getChecklist, createChecklist, removeChecklist, removePreset, updateChecklist } from "@Controllers/preset-controller.js";
import { Router } from 'express'
import { authenticateUser, authorzied } from "@Controllers/util-controller.js";
const router = Router()


router.get('/preset/:id', authenticateUser, authorzied(['admin', 'inspector']), getPreset)
router.get('/presets', authenticateUser, authorzied(['admin', 'inspector']), getAllPresets)
router.post('/preset', authenticateUser, authorzied(['admin']), createPreset)
router.put('/preset/:id', authenticateUser, authorzied(['admin']), updatePreset)
router.delete('/preset/:id', authenticateUser, authorzied(['admin']), removePreset);

router.get('/checklists', authenticateUser, authorzied(['admin', 'inspector']), getAllChecklists)
router.get('/checklist/:id', authenticateUser, authorzied(['admin', 'inspector']), getChecklist)
router.post('/checklist', authenticateUser, authorzied(['admin']), createChecklist)
router.put('/checklist/:id', authenticateUser, authorzied(['admin']), updateChecklist)
router.delete('/checklist/:id', authenticateUser, authorzied(['admin']), removeChecklist)

export default router
