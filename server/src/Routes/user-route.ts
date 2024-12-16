import { createUser, getUser, updateProfile, getAllUsers, updateUser, removeUser } from "@Controllers/user-controller.js";
import { Router } from 'express'
import { authenticateUser, authorzied } from "@Controllers/util-controller.js";
import { upload } from "@Controllers/util-controller.js";
const router = Router()

router.get('/users', authenticateUser, getAllUsers)
router.get('/user', authenticateUser, getUser)
router.get('/user/:id', authenticateUser, getUser)
router.post('/user', authenticateUser, authorzied(['admin']), createUser)
router.put('/profile', authenticateUser, upload.single('image'), updateProfile)
router.put('/user/:id',authenticateUser,updateUser)
router.delete('/user/:id', authenticateUser, authorzied(['admin']), removeUser)

export default router
