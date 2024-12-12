import { prisma } from '@Utils/database.js'
import { Request, Response } from 'express'

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Zone
 * Input: 
 * - (req as any).user.role: String (ต้องเป็น "admin")
 * - (req.params.id): Int (ID ของ Zone)
 * Output: JSON object ข้อมูล Zone
**/
export async function getZone(req: Request, res: Response) {
    try {
        const userRole = (req as any).user.role;
        if (userRole !== 'admin' && userRole !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Admins only" });
            return
        }
        const zoneId = parseInt(req.params.id, 10)
        const zone = await prisma.zone.findUnique({
            where: { id: zoneId },
            include: {
                supervisor: {
                    include: {
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
        res.status(500).json(error)
        return
    }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Location
 * Input: 
 * - (req as any).user.role: String (ต้องเป็น "admin")
 * - (req.params.id): Int (ID ของ Location)
 * Output: JSON object ข้อมูล Location
**/
export async function getLocation(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const userRole = (req as any).user.role;
        if (userRole !== 'admin' && userRole !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Admins only" });
            return
        }
        const location = await prisma.location.findUnique({
            where: { id: id },
            include: {
                zones: true
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
        res.status(500).json(error)
        return
    }
}