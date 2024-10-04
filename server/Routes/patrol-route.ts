import { createPatrol, getAllPatrols, getPatrol } from "../Controllers/patrol-controller";
import { getAllPresets } from "../Controllers/preset-controller";
import { Router } from 'express'
import { authenticateUser } from "../Controllers/util-controller";
const router = Router()

router.get('/patrols', authenticateUser, getAllPatrols)
router.get('/patrol/:id', authenticateUser, getPatrol)

router.post('/patrols', createPatrol)

module.exports = router