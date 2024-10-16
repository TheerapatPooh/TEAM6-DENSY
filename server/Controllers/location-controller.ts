import  { prisma } from '../Utils/database'
import  { Request, Response } from 'express'

export async function getZone(req: Request, res: Response) {
    try {
        const zoneId = parseInt(req.params.id, 10)
        const zone = await prisma.zone.findUnique({
            where: {ze_id: zoneId}, 
            include: {
                supervisor: true
            }
        })
        if(!zone) {
            return res.status(404)
        }
        res.send(zone)
    } catch (err) {
        res.status(500)
    }
}
