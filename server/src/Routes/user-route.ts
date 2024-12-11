import { createUser, getUser, updateProfile, getAllUsers, updateUser } from "@Controllers/user-controller.js";
import { Router } from 'express'
import { authenticateUser } from "@Controllers/util-controller.js";
import { upload } from "@Controllers/util-controller.js";
const router = Router()

router.get('/users', authenticateUser, getAllUsers)
router.get('/user', authenticateUser, getUser)
router.get('/user/:id', authenticateUser, getUser)
router.post('/user', authenticateUser, createUser)
router.put('/profile', authenticateUser, upload.single('image'), updateProfile)
router.put('/user/:id',authenticateUser,updateUser)

export default router
