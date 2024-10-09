import { getAllPatrols, getPatrol, createPatrol, startPatrol, finishPatrol } from "../Controllers/patrol-controller";
import { Router } from 'express'
import { authenticateUser } from "../Controllers/util-controller";
const router = Router()

router.get('/patrols', authenticateUser, getAllPatrols)
router.get('/patrol/:id', authenticateUser, getPatrol)

router.post('/patrol', authenticateUser, createPatrol)
router.put('/patrol/:id/start', authenticateUser, startPatrol)
router.put('/patrol/:id/finish', authenticateUser, finishPatrol)

module.exports = router