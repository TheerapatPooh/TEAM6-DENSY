import { createDefect,getDefect, getAllDefects, deleteDefect, updateDefect,} from "@Controllers/defect-controller.js";
import { Router } from 'express'
import { authenticateUser, upload } from "@Controllers/util-controller.js";

const router = Router()

router.post('/defect', (req, res, next) => {
    next();
}, upload.array('imageFiles', 10), authenticateUser, createDefect);
router.get('/defect/:id', authenticateUser, getDefect)
router.get('/defects', authenticateUser, getAllDefects)
router.put('/defect/:id',
    upload.array('imageFiles', 10),
    authenticateUser,
    updateDefect
  );
  router.delete('/defect/:id', authenticateUser, deleteDefect)

export default router
