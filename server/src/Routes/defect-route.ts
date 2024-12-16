import { createDefect, getDefect, getAllDefects, deleteDefect, updateDefect, } from "@Controllers/defect-controller.js";
import { Router } from 'express'
import { authenticateUser, authorzied, upload } from "@Controllers/util-controller.js";

const router = Router()

router.post('/defect', authorzied(['admin', 'inspector']), (req, res, next) => {
  next();
}, upload.array('imageFiles', 10), authenticateUser, createDefect);
router.get('/defect/:id', authenticateUser, getDefect)
router.get('/defects', authenticateUser, authorzied(['admin', 'supervisor']), getAllDefects)
router.put('/defect/:id',
  authorzied(['admin', 'inspector']),
  upload.array('imageFiles', 10),
  authenticateUser,
  updateDefect
);
router.delete('/defect/:id', authenticateUser, authorzied(['admin', 'inspector']), deleteDefect)

export default router
