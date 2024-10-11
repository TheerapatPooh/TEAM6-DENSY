
import { prisma } from '../Utils/database'
import { Request, Response } from 'express'

export async function getPatrol(req: Request, res: Response) {
    try {
        const role = (req as any).user.role
        const userId = (req as any).user.userId
        const patrolId = parseInt(req.params.id, 10)

        if (role !== 'admin' && role !== 'inspector') {
            return res.status(403).json({ message: "Access Denied: Admins or Inspectors only" })
        }

        let patrol: any

        if (role === 'admin') {
            patrol = await prisma.patrol.findUnique({
                where: {
                    pt_id: patrolId
                },
                include: {
                    preset: true,
                    checklist: {
                        include: {
                            checklist: {
                                include: {
                                    item: {
                                        include: {
                                            item_zone: {
                                                include: {
                                                    zone: true
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            inspector: {
                                include: {
                                    profile: {
                                        include: {
                                            pf_image: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    patrol_result: true
                }
            })
        }

        if (role === 'inspector') {
            patrol = await prisma.patrol.findFirst({
                where: {
                    pt_id: patrolId,
                    checklist: {
                        some: {
                            ptcl_us_id: userId
                        }
                    }
                },
                include: {
                    preset: true,
                    checklist: {
                        include: {
                            checklist: {
                                include: {
                                    item: {
                                        include: {
                                            item_zone: {
                                                include: {
                                                    zone: true
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            inspector: {
                                include: {
                                    profile: {
                                        include: {
                                            pf_image: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    patrol_result: true
                }
            })
        }

        if (!patrol) {
            return res.status(404)
        }

        const result = {
            id: patrol.pt_id,
            date: patrol.pt_date,
            startTime: patrol.pt_start_time ?? null,
            endTime: patrol.pt_end_time ?? null,
            duration: patrol.pt_duration ?? null,
            status: patrol.pt_status,
            preset: {
                id: patrol.preset.ps_id,
                title: patrol.preset.ps_title,
                description: patrol.preset.ps_description,
                version: patrol.preset.ps_version,
            },
            checklist: patrol.checklist.map((checklist: any) => ({
                id: checklist.ptcl_id,
                title: checklist.checklist.cl_title,
                version: checklist.checklist.cl_version,
                inspector: {
                    id: checklist.inspector.us_id,
                    name: checklist.inspector.profile?.pf_name,
                    age: checklist.inspector.profile?.pf_age,
                    tel: checklist.inspector.profile?.pf_tel,
                    address: checklist.inspector.profile?.pf_address,
                    imagePath: checklist.inspector.profile?.pf_image?.im_path ?? null // เพิ่ม imagePath
                },
                item: checklist.checklist.item.map((item: any) => ({
                    id: item.it_id,
                    name: item.it_name,
                    type: item.it_type,
                    zone: item.item_zone.map((zone: any) => ({
                        id: zone.zone.ze_id,
                        name: zone.zone.ze_name,
                    })),
                })),
            })),
            result: patrol.patrol_result.map((result: any) => ({
                id: result.pr_id,
                status: result.pr_status,
                itemId: result.pr_iz_it_id,
                zoneId: result.pr_iz_ze_id,
            })) ?? [],
        }

        res.status(200).json(result)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function getAllPatrols(req: Request, res: Response) {
    try {
        const role = (req as any).user.role
        const userId = (req as any).user.userId
        if (role !== 'admin' && role !== 'inspector') {
            return res.status(403).json({ message: "Access Denied: Admins only" })
        }
        let allPatrols: any

        if (role === 'admin') {
            allPatrols = await prisma.patrol.findMany({
                include: {
                    preset: true,
                    checklist: {
                        include: {
                            checklist: {
                                include: {
                                    item: {
                                        include: {
                                            item_zone: {
                                                include: {
                                                    zone: true
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            inspector: {
                                include: {
                                    profile: {
                                        include: {
                                            pf_image: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    patrol_result: true
                }
            })
        }
        if (role === 'inspector') {
            allPatrols = await prisma.patrol.findMany({
                where: {
                    checklist: {
                        some: {
                            ptcl_us_id: userId
                        }
                    }
                },
                include: {
                    preset: true,
                    checklist: {
                        include: {
                            checklist: {
                                include: {
                                    item: {
                                        include: {
                                            item_zone: {
                                                include: {
                                                    zone: true
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            inspector: {
                                include: {
                                    profile: {
                                        include: {
                                            pf_image: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    patrol_result: true
                }
            })
        }

        const result = allPatrols.map((patrol: any) => ({
            id: patrol.pt_id,
            date: patrol.pt_date,
            startTime: patrol.pt_start_time ?? null,
            endTime: patrol.pt_end_time ?? null,
            duration: patrol.pt_duration ?? null,
            status: patrol.pt_status,
            preset: {
                id: patrol.preset.ps_id,
                title: patrol.preset.ps_title,
                description: patrol.preset.ps_description,
                version: patrol.preset.ps_version,
            },
            checklist: patrol.checklist.map((checklist: any) => ({
                id: checklist.ptcl_id,
                title: checklist.checklist.cl_title,
                version: checklist.checklist.cl_version,
                inspector: {
                    id: checklist.inspector.us_id,
                    name: checklist.inspector.profile?.pf_name,
                    age: checklist.inspector.profile?.pf_age,
                    tel: checklist.inspector.profile?.pf_tel,
                    address: checklist.inspector.profile?.pf_address,
                    imagePath: checklist.inspector.profile?.pf_image?.im_path ?? null // เพิ่ม imagePath
                },
                item: checklist.checklist.item.map((item: any) => ({
                    id: item.it_id,
                    name: item.it_name,
                    type: item.it_type,
                    zone: item.item_zone.map((zone: any) => ({
                        id: zone.zone.ze_id,
                        name: zone.zone.ze_name,
                    })),
                })),
            })),
            result: patrol.patrol_result.map((result: any) => ({
                id: result.pr_id,
                status: result.pr_status,
                itemId: result.pr_it_id,
                defectId: result.pr_df_id ?? null,
            })) ?? [],
        }))
        res.status(200).json(result)

    } catch (error) {
        res.status(500)
    }
}

export async function createPatrol(req: Request, res: Response) {
    try {
        const userRole = (req as any).user.role
        if (userRole !== 'admin' && userRole !== 'inspector') {
            return res.status(403).json({ message: "Access Denied: Admins only" })
        }
        const { date, presetId, checklists } = req.body

        if (!date || !presetId || !checklists) {
            return res.status(400)
        }

        const newPatrol = await prisma.patrol.create({
            data: {
                pt_date: new Date(date),
                pt_status: "pending",
                pt_ps_id: parseInt(presetId, 10),
            }
        })

        for (const checklist of checklists) {
            const { checklistId, inspectorId } = checklist

            if (!checklistId || !inspectorId) {
                return res.status(400)
            }

            await prisma.patrolChecklist.create({
                data: {
                    ptcl_pt_id: newPatrol.pt_id,
                    ptcl_cl_id: checklistId,
                    ptcl_us_id: inspectorId,
                },
            })
        }

        res.status(201).json(newPatrol)

    } catch (err) {
        res.status(500)
    }
}

export async function startPatrol(req: Request, res: Response) {
    try {
        const role = (req as any).user.role
        const userId = (req as any).user.userId
        const patrolId = parseInt(req.params.id, 10)
        const { status, checklist } = req.body

        const isUserInspector = checklist.some((checklistObj: any) => {
            return checklistObj.inspector.id === userId;
        });

        if (!isUserInspector) {
            return res.status(403).json({ message: "You are not authorized to start this patrol. Only assigned inspectors can start the patrol." });
        }

        if (role !== 'admin' && role !== 'inspector') {
            return res.status(403).json({ message: "Access Denied" })
        }

        if (!status || !checklist) {
            return res.status(400)
        }

        if (status !== 'scheduled') {
            return res.status(403).json({ message: "Cannot start patrol." });
        }

        const updatePatrol = await prisma.patrol.update({
            where: {
                pt_id: patrolId,
            },
            data: {
                pt_status: 'on_going',
                pt_start_time: new Date(),
            },
        });

        for (const checklistObj of checklist) {
            const { item } = checklistObj;


            for (const itemObj of item) {
                const { id: itemId, zone } = itemObj;


                for (const zoneObj of zone) {
                    const { id: zoneId } = zoneObj;


                    await prisma.patrolResult.create({
                        data: {
                            pr_status: null,
                            pr_iz_it_id: itemId,
                            pr_iz_ze_id: zoneId,
                            pr_pt_id: updatePatrol.pt_id,
                        },
                    });
                }
            }
        }

        res.status(200).json(updatePatrol)

    } catch (err) {
        res.status(500)
    }
}

export async function finishPatrol(req: Request, res: Response) {
    try {
        const role = (req as any).user.role
        const userId = (req as any).user.userId
        const patrolId = parseInt(req.params.id, 10)
        const { status, checklist, result } = req.body

        if (role !== 'admin' && role !== 'inspector') {
            return res.status(403).json({ message: "Access Denied" })
        }

        const isUserInspector = checklist.some((checklistObj: any) => {
            return checklistObj.inspector.id === userId;
        });

        if (!isUserInspector) {
            return res.status(403).json({ message: "You are not authorized to finish this patrol. Only assigned inspectors can start the patrol." });
        }


        if (!checklist || !result) {
            return res.status(400).json({ message: "Invalid Data" })
        }

        if (status !== 'on_going') {
            return res.status(403).json({ message: "Cannot finish patrol." });
        }

        const updatePatrol = await prisma.patrol.update({
            where: {
                pt_id: patrolId,
            },
            data: {
                pt_status: 'completed',
                pt_end_time: new Date(),
            },
        });

        for (const resultObj of result) {
            const { id, status } = resultObj;
        
            await prisma.patrolResult.update({
                where: {
                    pr_id: id,
                },
                data: {
                    pr_status: status,
                },
            });
        }
        
        res.status(200).json(updatePatrol)

    } catch (err) {
        res.status(500)
    }
}


export async function removePatrol(req: Request, res: Response) {
    try {
        const patrolId = parseInt(req.params.id, 10);

        await prisma.patrolChecklist.deleteMany({
            where: {
                ptcl_pt_id: patrolId,
            },
        });

        await prisma.patrolResult.deleteMany({
            where: {
                pr_pt_id: patrolId,
            }
        });

        await prisma.patrol.delete({
            where: {
                pt_id: patrolId,
            },
        });

        res.status(200).json({
            message: 'Patrol and related records successfully deleted',
        });
    } catch (error) {
        console.error(error); 
        res.status(500).json({
            message: 'Failed to delete patrol',
        });
    }
    
}
