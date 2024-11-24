import { prisma } from '@Utils/database.js'
import { Request, Response } from 'express'
import transformKeys, { keyMap } from '@Utils/key-map.js';

export async function getZone(req: Request, res: Response) {
    try {
        const userRole = (req as any).user.role;
        if (userRole !== 'admin' && userRole !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Admins only" });
            return
        }
        const zoneId = parseInt(req.params.id, 10)
        const zone = await prisma.zone.findUnique({
            where: { ze_id: zoneId },
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
        let result = transformKeys(zone, keyMap);
     
        res.status(200).send(result)
        return
    } catch (err) {
        res.status(500)
        return
    }
}

export async function getLocation(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const userRole = (req as any).user.role;
        if (userRole !== 'admin' && userRole !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Admins only" });
            return
        }
        const location = await prisma.location.findUnique({
            where: { lt_id: id },
            include: {
                zone: true
            }
        })

        if (!location) {
            res.status(404)
            return
        }

        let result = transformKeys(location, keyMap);

        res.send(result)
        return
    } catch (err) {
        res.status(500)
        return
    }
}