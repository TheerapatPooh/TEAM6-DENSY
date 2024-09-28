import { getUser, getAllUsers, createUsers, getProfile } from "../Controllers/user-controller";
import { Router } from 'express'
import { authenticateUser } from "../Controllers/util-controller";
const router = Router()

router.get('/users', getAllUsers)
router.get('/user/:id', getUser)
router.post('/user', createUsers)
router.get('/profile', authenticateUser, getProfile)

module.exports = router