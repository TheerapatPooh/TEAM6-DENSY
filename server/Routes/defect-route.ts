import { createDefect,getDefect, getAllDefect, deleteDefect, updateDefect,} from "../Controllers/defect-controller";
import { Router } from 'express'
import { authenticateUser, upload } from "../Controllers/util-controller";

const router = Router()

router.post('/defect', (req, res, next) => {
    console.log(req.body); // This will log all non-file fields
    console.log(req.files); // This will log the uploaded files
    next();
}, upload.array('imageFiles', 10), authenticateUser, createDefect);
router.get('/defect/:id', authenticateUser, getDefect)
router.get('/defects/:id', authenticateUser, getAllDefect)
router.put('/defect/:id', authenticateUser, updateDefect)
router.delete('/defect/:id', authenticateUser, deleteDefect)

module.exports = router