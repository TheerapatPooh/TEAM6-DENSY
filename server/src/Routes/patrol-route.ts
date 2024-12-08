import { getAllPatrols, getPatrol, createPatrol, startPatrol, finishPatrol, removePatrol, commentPatrol, getCommentPatrol, schedulePatrolStatusUpdate, getAllPatrolDefects } from "@Controllers/patrol-controller.js";
import { Router } from 'express'
import { authenticateUser } from "@Controllers/util-controller.js";
const router = Router()

router.get('/patrols', authenticateUser, getAllPatrols)
router.get('/patrol/:id', authenticateUser, getPatrol)
router.post('/patrol', authenticateUser, createPatrol)
router.put('/patrol/:id/start', authenticateUser, startPatrol)
router.put('/patrol/:id/finish', authenticateUser, finishPatrol)
router.delete('/patrol/:id', authenticateUser, removePatrol)
router.post('/patrol/:id/comment', authenticateUser, commentPatrol);
router.get('/patrol/:id/comment', authenticateUser, getCommentPatrol)
router.get('/patrol/:id/defects', authenticateUser, getAllPatrolDefects)

schedulePatrolStatusUpdate();

export default router
