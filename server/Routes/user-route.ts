import { getUser, getAllUsers, createUsers } from "../Controllers/user-controller";
import { Router } from 'express'
const router = Router()

router.get('/users/:id', getUser)
router.get('/users', getAllUsers)
router.post('/users', createUsers)

module.exports = router