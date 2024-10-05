import { getUser, getAllUsers, createUser, getProfile } from "../Controllers/user-controller";
import { Router } from 'express'
import { authenticateUser } from "../Controllers/util-controller";
import { upload } from "../Controllers/util-controller";
const router = Router()

router.get('/users', authenticateUser, getAllUsers)
router.get('/user/:id', authenticateUser, getUser)
router.post('/user', authenticateUser, createUser)
router.get('/profile', authenticateUser, getProfile)
router.put('/profile', authenticateUser, upload.single('image'), getProfile)

module.exports = router