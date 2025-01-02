import { authenticateUser,removeOldNotifications, getNotifications, login, logout, markAllAsRead, updateNotification, removeNotification, removeAllNotifications } from "@Controllers/util-controller.js";
import { Router } from "express";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/notifications", authenticateUser, getNotifications);
router.put("/notification/:id", authenticateUser, updateNotification);
router.delete("/notification/:id", authenticateUser, removeNotification);
router.delete("notifications", authenticateUser, removeAllNotifications);
router.put("/notifications/mark-all-read", authenticateUser, markAllAsRead);
removeOldNotifications()

export default router
