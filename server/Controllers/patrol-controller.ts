import  { prisma } from '../Utils/database'
import  { Request, Response } from 'express'

export async function getPatrol(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10); 
        const patrol = await prisma.patrols.findUnique
        ({ 
            where: {id},
            include: {
                preset: {
                    include: {
                        checklist: {
                            include: {
                                checklist: {
                                    include: {
                                        item: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        
        if (patrol){
            const patrolDetails = {
                id: patrol.id,
                date: patrol.date,
                start_time: patrol.start_time,
                end_time: patrol.end_time,
                duration: patrol.duration,
                status: patrol.status,
                preset: {
                    id: patrol.preset.id,
                    title: patrol.preset.title,
                    description: patrol.preset.description,
                    version: patrol.preset.version,
                    lastest: patrol.preset.lastest,
                    updateAt: patrol.preset.updateAt,
                    updateBy: patrol.preset.updateBy,

                    checklists: patrol.preset.checklist.map((checklist: any) => ({
                        id: checklist.checklists_id,
                        title: checklist.checklist.title,
                        version: checklist.checklist.version,
                        lasted: checklist.checklist.lasted,
                        updateAt: checklist.checklist.updateAt,
                        updateBy: checklist.checklist.updateBy,
                        inspectorId: checklist.checklist.inspectorId,
                        items: checklist.checklist.item.map((item: any) => ({
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            zones_id: item.zones_id
                        }))
                    }))
                }
            };
            res.send(patrolDetails)

        } else {
            res.status(404).send('Patrol not found')
        }

    } catch (err) {
        res.status(500).send(err)
    }
}

export async function getAllPatrols(req: Request, res: Response) {
    try {
        const all_patrols = await prisma.patrols.findMany()
        if (all_patrols) {
            res.send(all_patrols)
        } else {
            res.status(404).send('All Patrol not found')
        }
    } catch (err) {
        res.status(500).send(err)
    }
}