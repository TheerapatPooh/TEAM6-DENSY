import prisma from '@Utils/database.js'
import { Request, Response } from 'express'
import { createNotification } from '@Controllers/util-controller.js'
import { NotificationType } from '@prisma/client'

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Zone
 * Input: 
 * - (req.params.id): Int (ID ของ Zone)
 * Output: JSON object ข้อมูล Zone
**/
export async function getZone(req: Request, res: Response) {
    try {
        const zoneId = parseInt(req.params.id, 10)
        const zone = await prisma.zone.findUnique({
            where: { id: zoneId },
            include: {
                supervisor: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                        department: true,
                        createdAt: true,
                        profile: {
                            include: {
                                image: true
                            }
                        }
                    }
                }
            }
        })
        if (!zone) {
            res.status(404)
            return
        }
        let result = zone;

        res.status(200).send(result)
        return
    } catch (error) {
        res.status(500)
        return
    }
}

export async function getAllZone(req: Request, res: Response) {
    try {
        const zone = await prisma.zone.findMany({
            select: {
               id:true,
               name:true,
            }
        })
        if (!zone) {
            res.status(404)
            return
        }
        let result = zone;

        res.status(200).send(result)
        return
    } catch (error) {
        res.status(500)
        return
    }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Location
 * Input: 
 * - (req.params.id): Int (ID ของ Location)
 * Output: JSON object ข้อมูล Location
**/
export async function getLocation(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const location = await prisma.location.findUnique({
            where: { id: id },
            include: {
                zones: {
                    include: {
                        supervisor: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                role: true,
                                department: true,
                                createdAt: true,
                                profile: {
                                    include: {
                                        image: true
                                    }
                                }
                            }
                        }
                    }
                },
            }
        })

        if (!location) {
            res.status(404)
            return
        }

        let result = location;

        res.send(result)
        return
    } catch (error) {
        res.status(500)
        return
    }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับเปลี่ยน Supervisor
 * Input:
 * - req.params.id: number (ID ของ Zone ที่ต้องการเปลี่ยน Supervisor)
 * - req.body: {
 *     userId: number,
 * Output: JSON object ข้อมูล Zone หลังจาก update
**/
export async function updateSupervisor(req: Request, res: Response) {
    try {
        const zoneId = parseInt(req.params.id, 10);
        const { userId } = req.body;

        const oldZone = await prisma.zone.findUnique({
            where: { userId: userId },
        });

        if (oldZone && oldZone.id !== zoneId) {
            await prisma.zone.update({
                where: { id: oldZone.id },
                data: { userId: null },
            });
        }

        // อัปเดต zone
        await prisma.zone.update({
            where: { id: zoneId },
            data: {
                userId: userId ? parseInt(userId, 10) : null,
            },
        });

        let result = await prisma.zone.findUnique({
            where: {
                id: zoneId
            },
            include: {
                supervisor: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                        department: true,
                        createdAt: true,
                        profile: {
                            include: {
                                image: true
                            }
                        }
                    }
                }
            },
        });

        const message = `update_supervisor-${result?.name}`;
        await createNotification({
            message: message,
            type: "information" as NotificationType,
            url: `/profile`,
            userId: userId,
        });

        res.status(200).json(result);
        return;
    } catch (error) {
        res.status(500);
        return;
    }
}