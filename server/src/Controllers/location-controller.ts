import { prisma } from '@Utils/database.js'
import { Request, Response } from 'express'

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
                                pf_image: true
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
                image: {
                    id: zone.supervisor.profile?.pf_image?.im_id,
                    path: zone.supervisor.profile?.pf_image?.im_path
                }
            }
        }
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
                zone: {
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
                }
            }
        })

        if (!location) {
            res.status(404)
            return
        }

        const result = {
            id: location.lt_id,
            name: location.lt_name,
            zone: location.zone.map((zone) => ({
                id: zone.ze_id,
                name: zone.ze_name,
                supervisor: {
                    id: zone.supervisor.us_id,
                    name: zone.supervisor.profile?.pf_name,
                    email: zone.supervisor.us_email,
                    department: zone.supervisor.us_department,
                    age: zone.supervisor.profile?.pf_age,
                    tel: zone.supervisor.profile?.pf_tel,
                    address: zone.supervisor.profile?.pf_tel,
                    image: {
                        id: zone.supervisor.profile?.pf_image?.im_id,
                        path: zone.supervisor.profile?.pf_image?.im_path
                    }
                }
                
            }))
        }

        res.send(result)
        return
    } catch (err) {
        res.status(500)
        return
    }
}