import { createPatrol, getAllPatrols, getPatrol } from "../Controllers/patrol-controller";
import { Router } from 'express'
const router = Router()

router.get('/patrols', getAllPatrols)
router.get('/patrol/:id', getPatrol)
router.post('/patrols', createPatrol)

module.exports = router