import { getAllPatrols, getPatrol, createPatrol, startPatrol, finishPatrol, removePatrol, commentPatrol, schedulePatrolStatusUpdate, getAllPatrolDefects, getPatrolUser } from "@Controllers/patrol-controller.js";
import { Router } from 'express'
import { authenticateUser, authorzied } from "@Controllers/util-controller.js";
const router = Router()

router.get('/patrol/:id?/defects', authenticateUser, getAllPatrolDefects)
router.get('/patrols', authenticateUser, authorzied(['admin', 'inspector']), getAllPatrols)
router.get('/patrol/:id', authenticateUser, authorzied(['admin', 'inspector']), getPatrol)
router.post('/patrol', authenticateUser, authorzied(['admin', 'inspector']), createPatrol)
router.put('/patrol/:id/start', authenticateUser, authorzied(['admin', 'inspector']), startPatrol)
router.put('/patrol/:id/finish', authenticateUser, authorzied(['admin', 'inspector']), finishPatrol)
router.delete('/patrol/:id', authenticateUser, authorzied(['admin', 'inspector']), removePatrol)
router.post('/patrol/:id/comment', authenticateUser, authorzied(['admin', 'inspector']), commentPatrol);
router.get('/patrol/:id/defects', authenticateUser, authorzied(['admin', 'inspector']), getAllPatrolDefects)
router.get('/patrol/:id/user', authenticateUser, authorzied(['admin', 'inspector']), getPatrolUser)

schedulePatrolStatusUpdate();

export default router
