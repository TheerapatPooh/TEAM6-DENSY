import { login } from "../Controllers/util-controller";
import { Router } from "express";
const router = Router();

router.post("/login", login);

module.exports = router;
