import { getUser, getAllUsers, createUsers } from "../Controllers/user-controller";
import { Router } from 'express'
const router = Router()

router.get('/users', getAllUsers)
router.get('/user/:id', getUser)
router.post('/user', createUsers)

module.exports = router