import { getAllPatrols, getPatrol, createPatrol } from "../Controllers/patrol-controller";
import { Router } from 'express'
import { authenticateUser } from "../Controllers/util-controller";
const router = Router()

router.get('/patrols', authenticateUser, getAllPatrols)
router.get('/patrol/:id', authenticateUser, getPatrol)

router.post('/patrol', authenticateUser, createPatrol)

module.exports = router