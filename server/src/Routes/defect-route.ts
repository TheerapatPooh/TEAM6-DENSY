import { createDefect, getDefect, getAllDefects, deleteDefect, updateDefect, } from "@Controllers/defect-controller.js";
import { Router } from 'express'
import { authenticateUser, authorzied, upload } from "@Controllers/util-controller.js";

const router = Router()

router.post('/defect', (req, res, next) => {
  next();
}, upload.array('imageFiles', 10), authenticateUser, authorzied(['admin', 'inspector']), createDefect);
router.get('/defect/:id', authenticateUser, authorzied(['admin', 'supervisor']), getDefect)
router.get('/defects', authenticateUser, authorzied(['admin', 'supervisor']), getAllDefects)
router.put('/defect/:id',
  upload.array('imageFiles', 10),
  authenticateUser,
  authorzied(['admin', 'inspector']),
  updateDefect
);
router.delete('/defect/:id', authenticateUser, authorzied(['admin', 'inspector']), deleteDefect)

export default router
