import { getUser, getAllUsers, createUser, getProfile, updateProfile, getAllProfile, updateUser, deleteUser } from "../Controllers/user-controller";
import { Router } from 'express'
import { authenticateUser } from "../Controllers/util-controller";
import { upload } from "../Controllers/util-controller";
const router = Router()

router.get('/users', authenticateUser, getAllUsers)
router.get('/user/:id', authenticateUser, getUser)
router.post('/user', authenticateUser, createUser)
router.get('/profiles', getAllProfile)
router.get('/profile', authenticateUser, getProfile)
router.get('/profile/:id', authenticateUser, getProfile)
router.put('/profile', authenticateUser, upload.single('image'), updateProfile)
router.put('/user/:id',authenticateUser,updateUser)
router.delete('/user/:id', authenticateUser, deleteUser)
module.exports = router