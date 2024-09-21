import { getAllPatrols, getPatrol } from "../Controllers/patrol-controller";
import { Router } from 'express'
const router = Router()

router.get('/patrols', getAllPatrols)
router.get('/patrol/:id', getPatrol)

module.exports = router