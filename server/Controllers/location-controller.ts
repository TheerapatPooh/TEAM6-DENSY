import { prisma } from '../Utils/database'
import { Request, Response } from 'express'

export async function getZone(req: Request, res: Response) {
    try {
        const userRole = (req as any).user.role;
        if (userRole !== 'admin' && userRole !== 'inspector') {
             res.status(403).json({ message: "Access Denied: Admins only" });
        }
        const zoneId = parseInt(req.params.id, 10)
        const zone = await prisma.zone.findUnique({
            where: { ze_id: zoneId },
            include: {
                supervisor: {
                    include: {
                        profile: {
                            include: {
                                pf_image: true
                            }
                        }
                    }
                }
            }
        })
        if (!zone) {
             res.status(404)
        }
        const result = {
            id: zone.ze_id,
            name: zone.ze_name,
            supervisor: {
                userId: zone.supervisor.us_id,
                email: zone.supervisor.us_email,
                department: zone.supervisor.us_department,
                age: zone.supervisor.profile?.pf_age,
                tel: zone.supervisor.profile?.pf_tel,
                address: zone.supervisor.profile?.pf_address,
                imagePath: zone.supervisor.profile?.pf_image?.im_path || null
            }
        }
        res.send(result)
    } catch (err) {
        res.status(500)
    }
}

export async function getAllZones(req: Request, res: Response) {
    try {
        const userRole = (req as any).user.role;
        if (userRole !== 'admin' && userRole !== 'inspector') {
             res.status(403).json({ message: "Access Denied: Admins only" });
        }
        const allZone = await prisma.zone.findMany({
            include: {
                supervisor: {
                    include: {
                        profile: {
                            include: {
                                pf_image: true
                            }
                        }
                    }
                }
            }
        })
        if (!allZone) {
             res.status(404)
        }

        const result = allZone.map((zone) => ({
            id: zone.ze_id,
            name: zone.ze_name,
            supervisor: {
                userId: zone.supervisor.us_id,
                email: zone.supervisor.us_email,
                department: zone.supervisor.us_department,
                age: zone.supervisor.profile?.pf_age,
                tel: zone.supervisor.profile?.pf_tel,
                address: zone.supervisor.profile?.pf_address,
                imagePath: zone.supervisor.profile?.pf_image?.im_path || null
            }
        }))
        res.send(result)
    } catch (err) {
        res.status(500)
    }
}
