import  { prisma } from '../Utils/database'
import  { Request, Response } from 'express'


export async function getPatrol(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10); 
        const patrol = await prisma.patrol.findUnique
        ({ 
            where: {id},
            include: {
                preset: {
                    include: {
                        checklist: {
                            include: {
                                checklist: {
                                    include: {
                                        item:true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        if (patrol){
            const patrolDetail = {
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
                    lasted: patrol.preset.lasted,
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
            res.send(patrolDetail)

        } else {
            res.status(404).send('Patrol not found')
        }
       

    } catch (err) {
        res.status(500).send(err)
    }
}

export async function getAllPatrols(req: Request, res: Response) {
    try {
        const allPatrols = await prisma.patrol.findMany()
        if (allPatrols) {
            res.send(allPatrols)
        } else {
            res.status(404).send('No patrols found');
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).send('Internal Server Error');
    }
}

export async function createPatrol(req: Request, res: Response) {
    try {
         const { date, presets_id } = req.body;

         if (!date || !presets_id) {
             return res.status(400).json({ error: 'Missing required fields' });
         }

         const newPatrol = await prisma.patrol.create({
             data: {
                 date: new Date(date), 
                 status: "Pending",
                 presets_id: parseInt(presets_id, 10),
             }
         });
         res.status(201).json(newPatrol);
       
    } catch (err) {
        res.status(500).send(err)
    }
}