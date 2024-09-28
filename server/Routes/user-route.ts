import { getUser, getAllUsers, createUser, getProfile } from "../Controllers/user-controller";
import { Router } from 'express'
import { authenticateUser } from "../Controllers/util-controller";
const router = Router()

router.get('/users', getAllUsers)
router.get('/user/:id', getUser)
router.post('/user', createUser)
router.get('/profile', authenticateUser, getProfile)

module.exports = router