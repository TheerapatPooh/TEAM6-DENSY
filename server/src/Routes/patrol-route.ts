import { getAllPatrols, getPatrol, createPatrol, startPatrol, finishPatrol, removePatrol, updatePatrolStatus, getPendingPatrols, commentPatrol, getCommentPatrol, schedulePatrolStatusUpdate } from "@Controllers/patrol-controller.js";
import { Router } from 'express'
import { authenticateUser } from "@Controllers/util-controller.js";
const router = Router()

router.get('/patrols', authenticateUser, getAllPatrols)
router.get('/patrol/:id', authenticateUser, getPatrol)
router.get('/patrols/pending', getPendingPatrols)
router.post('/patrol', authenticateUser, createPatrol)
router.put('/patrol/:id/start', authenticateUser, startPatrol)
router.put('/patrol/:id/finish', authenticateUser, finishPatrol)
router.delete('/patrol/:id', authenticateUser, removePatrol)
router.post('/patrol/comment', authenticateUser, commentPatrol);
router.get('/patrol/comment/:id', authenticateUser, getCommentPatrol)

schedulePatrolStatusUpdate();

export default router