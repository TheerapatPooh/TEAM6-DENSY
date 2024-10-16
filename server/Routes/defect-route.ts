import { createDefect,getDefect, getAllDefect, deleteDefect, updateDefect,} from "../Controllers/defect-controller";
import { Router } from 'express'
const router = Router()

router.post('/defect', createDefect)
router.get('/defect/:id', getDefect)
router.get('/defect',  getAllDefect)
router.put('/defect/:id', updateDefect)
router.delete('/defect/:id', deleteDefect)

module.exports = router