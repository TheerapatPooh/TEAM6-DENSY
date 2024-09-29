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
        const all_patrols = await prisma.patrols.findMany({
            include: {
                preset: true,
                user: { // Include Users_Has_Patrols relation
                    include: {
                        user: { // Include the Users table data
                            select: { // Select only the fields you need
                                id: true,
                                username: true,
                                email: true,
                                password: true,
                                role: true,
                                department: true,
                                created_at: true,
                            },
                        },
                    },
                },
            },
        });

        if (all_patrols.length > 0) {
            res.send(all_patrols);
        } else {
            res.status(404).send('No patrols found');
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).send('Internal Server Error');
    }
}




export async function createPatrols(req: Request, res: Response) {
    try {
         const { date, presets_id } = req.body;

         if (!date || !presets_id) {
             return res.status(400).json({ error: 'Missing required fields' });
         }

         const newPatrol = await prisma.patrols.create({
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