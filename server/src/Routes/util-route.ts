import { authenticateUser, deleteOldNotifications, getNotifications, login, logout, markAllAsRead, updateNotification } from "@Controllers/util-controller.js";
import { Router } from "express";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/notifications", authenticateUser, getNotifications);
router.put("/notification/:id", authenticateUser, updateNotification);
router.put("/notifications/mark-all-read", authenticateUser, markAllAsRead);
deleteOldNotifications()

export default router
