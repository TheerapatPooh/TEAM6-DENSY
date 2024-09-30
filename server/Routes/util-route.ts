import { login, logout } from "../Controllers/util-controller";
import { Router } from "express";
const router = Router();

router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
