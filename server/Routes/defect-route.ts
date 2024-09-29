import { createDefect } from "../Controllers/defect-controller";
import { Router } from 'express'
const router = Router()

router.post('/defect', createDefect)

module.exports = router