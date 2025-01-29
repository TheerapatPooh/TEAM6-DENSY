import { Router } from 'express'
import { getAllZones, getLocation, getZone, updateSupervisor } from "@Controllers/location-controller.js";
import { authenticateUser, authorzied } from "@Controllers/util-controller.js";
const router = Router()

/**
 * @swagger
 * /api/zones:
 *   get:
 *     summary: Get all zones
 *     description: ดึงข้อมูลโซนทั้งหมด
 *     responses:
 *       200:
 *         description: Zones found
 *       404:
 *         description: Zones not found
 */
router.get('/zones', authenticateUser, getAllZones)

/**
 * @swagger
 * /api/zone/{id}:
 *   get:
 *     summary: Get zone by id
 *     description: ดึงข้อมูลโซนตาม id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Zone ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Zone found
 *       404:
 *         description: Zone not found
 */
router.get('/zone/:id', authenticateUser, getZone)

/**
 * @swagger
 * /api/location/{id}:
 *   get:
 *     summary: Get location by id
 *     description: ดึงข้อมูลสถานที่ตาม id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Location ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location found
 *       404:
 *         description: Location not found
 */
router.get('/location/:id', authenticateUser, getLocation)
router.put('/zone/:id', authenticateUser, authorzied(['admin']), updateSupervisor)

export default router
