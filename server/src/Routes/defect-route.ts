import { createDefect,getDefect, getAllDefect, deleteDefect, updateDefect,} from "@Controllers/defect-controller.js";
import { Router } from 'express'
import { authenticateUser, upload } from "@Controllers/util-controller.js";

const router = Router()

router.post('/defect', (req, res, next) => {
    next();
}, upload.array('imageFiles', 10), authenticateUser, createDefect);
router.get('/defect/:id', authenticateUser, getDefect)
router.get('/defects', authenticateUser, getAllDefect)
router.put('/defect/:id', authenticateUser, updateDefect)
router.delete('/defect/:id', authenticateUser, deleteDefect)

export default router
