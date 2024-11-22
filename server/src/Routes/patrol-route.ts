import { getAllPatrols, getPatrol, createPatrol, startPatrol, finishPatrol, removePatrol, getPendingPatrols, commentPatrol, getCommentPatrol, schedulePatrolStatusUpdate, getPatrolResult } from "@Controllers/patrol-controller.js";
import { Router } from 'express'
import { authenticateUser } from "@Controllers/util-controller.js";
const router = Router()

router.get('/patrols', authenticateUser, getAllPatrols)
router.get('/patrol/:id', authenticateUser, getPatrol)
router.get('/patrol/:id/result', authenticateUser, getPatrolResult)
router.get('/patrols/pending', getPendingPatrols)
router.post('/patrol', authenticateUser, createPatrol)
router.put('/patrol/:id/start', authenticateUser, startPatrol)
router.put('/patrol/:id/finish', authenticateUser, finishPatrol)
router.delete('/patrol/:id', authenticateUser, removePatrol)
router.post('/patrol/:id/comment', authenticateUser, commentPatrol);
router.get('/patrol/:id/comment', authenticateUser, getCommentPatrol)

schedulePatrolStatusUpdate();

export default router
