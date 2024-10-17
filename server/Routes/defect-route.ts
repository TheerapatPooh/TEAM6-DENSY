import { createDefect,getDefect, getAllDefect, deleteDefect, updateDefect,} from "../Controllers/defect-controller";
import { Router } from 'express'
import { authenticateUser } from "../Controllers/util-controller";
const router = Router()

router.post('/defect', authenticateUser, createDefect)
router.get('/defect/:id', authenticateUser, getDefect)
router.get('/defects/:id', authenticateUser, getAllDefect)
router.put('/defect/:id', authenticateUser, updateDefect)
router.delete('/defect/:id', authenticateUser, deleteDefect)

module.exports = router