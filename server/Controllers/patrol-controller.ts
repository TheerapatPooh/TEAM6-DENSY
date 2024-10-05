
import { prisma } from '../Utils/database'
import { Request, Response } from 'express'


export async function getPatrol(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId
        const user = await prisma.user.findUnique({
            where: { us_id: userId }
        })
        const patrolId = parseInt(req.params.id, 10);
        const patrol = await prisma.patrol.findUnique
            ({
                where: { pt_id: patrolId },
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
                    },
                    checklist: {
                        include: {
                            inspector: {
                                include: {
                                    profile: true
                                }
                            }
                        }
                    },
                }
            })
        if (!patrol) {
            return res.status(404).send('Patrol not found');
        }

        const isUserInPatrol = patrol.checklist.some((userPatrol) => userPatrol.pthc_us_id === userId)
        if (!isUserInPatrol && user?.us_role !== 'ADMIN') {
            return res.status(403).json({ message: "Access Denied" })
        }

        const patrolDetail = {
            id: patrol.pt_id,
            date: patrol.pt_date,
            startTime: patrol.pt_start_time,
            endTime: patrol.pt_end_time,
            duration: patrol.pt_duration,
            status: patrol.pt_status,
            preset: {
                id: patrol.preset.ps_id,
                title: patrol.preset.ps_title,
                description: patrol.preset.ps_description,
                version: patrol.preset.ps_version,
                lasted: patrol.preset.ps_lasted,
                updateAt: patrol.preset.ps_update_at,
                updateBy: patrol.preset.ps_us_id,

                checklists: patrol.preset.checklist.map((checklist: any, index: number) => ({
                    id: checklist.cl_id,
                    title: checklist.checklist.cl_title,
                    version: checklist.checklist.cl_version,
                    lasted: checklist.checklist.cl_lasted,
                    updateAt: checklist.checklist.cl_update_at,
                    updateBy: checklist.checklist.cl_us_id,
                    inspector: patrol.checklist[index].inspector.profile.map((inspector: any) => ({
                        id: inspector.pf_id,  
                        name: inspector.pf_name,  
                        age: inspector.pf_age,  
                        tel: inspector.pf_tel, 
                        address: inspector.pf_address,  
                        userId: inspector.pf_us_id
                    })),
                    items: checklist.checklist.item.map((item: any) => ({
                        id: item.it_id,
                        name: item.it_name,
                        type: item.it_type,
                        zoneId: item.it_ze_id
                    }))
                }))
            }
        };
        res.send(patrolDetail)

    } catch (err) {
        res.status(500).send(err)
    }
}

export async function getAllPatrols(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId
        const user = await prisma.user.findUnique({
            where: { us_id: userId }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.us_role === 'INSPECTOR') {
            const inspectorPatrols = await prisma.patrol.findMany({
                where: {
                    checklist: {
                        some: {
                            pthc_us_id: userId
                        }
                    }
                },
                include: {
                    preset: true,
                    checklist: {
                        include: {
                            inspector: true,
                            checklist: true
                        }
                    }
                }
            });

            if (inspectorPatrols.length > 0) {
                return res.json(inspectorPatrols);
            } else {
                return res.status(404).json({ message: 'No patrols found for you' });
            }
        } else if (user.us_role === 'ADMIN') {
            const allPatrols = await prisma.patrol.findMany({
                include: {
                    preset: true,
                    checklist: {
                        include: {
                            inspector: true,
                            checklist: true
                        }
                    }
                }
            });

            if (!allPatrols) {
                return res.status(404).send('Patrol not found');
            }

            const newAllPatrols = {
                Patrol: allPatrols.map((patrol: any) => ({
                    id: patrol.pt_id,
                    date: patrol.pt_date,
                    startTime: patrol.pt_start_time,
                    endTime: patrol.pt_end_time,
                    duration: patrol.pt_duration,
                    status: patrol.pt_status,
                    preset: patrol.pt_ps_id,
            
                    inspectors: patrol.checklist.map((checklist: any) => ({
                        id: checklist.inspector.us_id, // Access inspector details through checklist
                    }))
                }))
            };
            return res.json(newAllPatrols);
        } else {
            return res.status(403).json({ message: "Access Denied" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

export async function createPatrol(req: Request, res: Response) {
    try {
        const { date, presetId } = req.body;

        if (!date || !presetId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newPatrol = await prisma.patrol.create({
            data: {
                pt_date: new Date(date),
                pt_status: "Pending",
                pt_ps_id: parseInt(presetId, 10),
            }
        });
        res.status(201).json(newPatrol);

    } catch (err) {
        res.status(500).send(err)
    }
}