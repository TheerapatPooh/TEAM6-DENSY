import { prisma } from '@Utils/database.js'
import { Request, Response } from 'express'
import axios from 'axios';
import { createNotification } from '@Controllers/util-controller.js';
import { NotificationType } from '@prisma/client';
import transformKeys, { keyMap } from '@Utils/key-map.js';

export async function getPatrol(req: Request, res: Response) {
    try {
        const role = (req as any).user.role
        const userId = (req as any).user.userId
        const patrolId = parseInt(req.params.id, 10)

        if (role !== 'admin' && role !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Admins or Inspectors only" })
            return
        }

        let patrol: any
        if (role === 'admin') {
            patrol = await prisma.patrol.findFirst({
                where: {
                    pt_id: patrolId,
                },
                include: {
                    preset: true,
                    patrolChecklist: {
                        include: {
                            checklist: {
                                include: {
                                    item: {
                                        include: {
                                            itemZone: {
                                                select: {
                                                    zone: {
                                                        select: {
                                                            ze_id: true,
                                                            ze_name: true
                                                        }
                                                    }
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
                                            image: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }

        else if (role === 'inspector') {
            patrol = await prisma.patrol.findFirst({
                where: {
                    pt_id: patrolId,
                    patrolChecklist: {
                        some: {
                            ptcl_us_id: userId
                        }
                    }
                },
                include: {
                    preset: true,
                    patrolChecklist: {
                        include: {
                            checklist: {
                                include: {
                                    item: {
                                        include: {
                                            itemZone: {
                                                select: {
                                                    zone: {
                                                        select: {
                                                            ze_id: true,
                                                            ze_name: true,
                                                            supervisor: {
                                                                select: {
                                                                    us_id: true,
                                                                    profile: {
                                                                        select: {
                                                                            pf_name: true
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
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
                                            image: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }

        if (!patrol) {
            res.status(404)
            return
        }
        let result = transformKeys(patrol, keyMap);

        res.status(200).json(result)
        return
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
        return
    }
}

export async function getPatrolResult(req: Request, res: Response) {
    try {
        const role = (req as any).user.role
        const userId = (req as any).user.userId
        const patrolId = parseInt(req.params.id, 10)

        if (role !== 'admin' && role !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Admins or Inspectors only" })
            return
        }

        let patrol: any
        if (role === 'admin') {
            patrol = await prisma.patrol.findFirst({
                where: {
                    pt_id: patrolId,
                },
                select: {
                    result: {
                        include: {
                            defects: true
                        }
                    }
                }
            })
        }

        else if (role === 'inspector') {
            patrol = await prisma.patrol.findFirst({
                where: {
                    pt_id: patrolId,
                    patrolChecklist: {
                        some: {
                            ptcl_us_id: userId
                        }
                    }
                },
                select: {
                    result: {
                        include: {
                            defects: true
                        }
                    }
                }
            })
        }

        if (!patrol) {
            res.status(404)
            return
        }
        let result = transformKeys(patrol, keyMap);

        res.status(200).json(result)
        return
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
        return
    }
}

export async function getAllPatrols(req: Request, res: Response) {
    try {
        const role = (req as any).user.role
        const userId = (req as any).user.userId
        if (role !== 'admin' && role !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Admins only" })
            return
        }
        let allPatrols: any

        if (role === 'admin') {
            allPatrols = await prisma.patrol.findMany({
                include: {
                    preset: true,
                    patrolChecklist: {
                        include: {
                            checklist: {
                                include: {
                                    item: {
                                        include: {
                                            itemZone: {
                                                select: {
                                                    zone: {
                                                        select: {
                                                            ze_id: true,
                                                            ze_name: true
                                                        }
                                                    }
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
                                            image: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }
        if (role === 'inspector') {
            allPatrols = await prisma.patrol.findMany({
                where: {
                    patrolChecklist: {
                        some: {
                            ptcl_us_id: userId
                        }
                    }
                },
                include: {
                    preset: true,
                    patrolChecklist: {
                        include: {
                            checklist: {
                                include: {
                                    item: {
                                        include: {
                                            itemZone: {
                                                select: {
                                                    zone: {
                                                        select: {
                                                            ze_id: true,
                                                            ze_name: true
                                                        }
                                                    }
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
                                            image: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }
        let result = allPatrols.map((patrol: any) => transformKeys(patrol, keyMap));

        res.status(200).json(result)
        return
    } catch (error) {
        res.status(500)
        return
    }
}

export async function createPatrol(req: Request, res: Response) {
    try {
        const userRole = (req as any).user.role;
        if (userRole !== 'admin' && userRole !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Admins only" });
            return
        }

        const { date, presetId, checklists } = req.body;

        if (!date || !presetId || !checklists) {
            res.status(400).json({ message: "Missing required fields" });
            return
        }

        const patrolDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        patrolDate.setHours(0, 0, 0, 0);

        const status = patrolDate.getTime() === today.getTime() ? "scheduled" : "pending";

        const newPatrol = await prisma.patrol.create({
            data: {
                pt_date: patrolDate,
                pt_status: status,
                pt_ps_id: parseInt(presetId, 10),
            },
        });

        const notifiedInspectors = new Set<number>();

        for (const checklist of checklists) {
            const { checklistId, userId } = checklist;

            if (!checklistId || !userId) {
                continue
            }

            await prisma.patrolChecklist.create({
                data: {
                    ptcl_pt_id: newPatrol.pt_id,
                    ptcl_cl_id: checklistId,
                    ptcl_us_id: userId,
                },
            });

            if (!notifiedInspectors.has(userId)) {
                const message = `You have been assigned to a patrol scheduled for ${new Date(date).toLocaleDateString()}.`;
                await createNotification({
                    nt_message: message,
                    nt_type: 'request' as NotificationType,
                    nt_url: `/patrol/${newPatrol.pt_id}`,
                    nt_us_id: userId,
                });

                notifiedInspectors.add(userId);
            }
        }
        let result = transformKeys(newPatrol, keyMap);
        res.status(201).json(result);

    } catch (err) {
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
            res.status(403).json({ message: "You are not authorized to start this patrol. Only assigned inspectors can start the patrol." });
            return
        }

        if (role !== 'admin' && role !== 'inspector') {
            res.status(403).json({ message: "Access Denied" })
            return
        }

        if (!status || !checklist) {
            res.status(400)
            return
        }

        if (status !== 'scheduled') {
            res.status(403).json({ message: "Cannot start patrol." });
            return
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
            for (const item of checklistObj.checklist.item) {
                for (const zone of item.itemZone) {
                    await prisma.patrolResult.create({
                        data: {
                            pr_status: null,
                            pr_itze_it_id: item.id,
                            pr_itze_ze_id: zone.zone.id,
                            pr_pt_id: updatePatrol.pt_id,
                        },
                    });
                }
            }
        }
        let result = transformKeys(updatePatrol, keyMap);
        res.status(200).json(result)
        return
    } catch (err) {
        res.status(500)
        return
    }
}

export async function finishPatrol(req: Request, res: Response) {
    try {
        const role = (req as any).user.role
        const userId = (req as any).user.userId
        const patrolId = parseInt(req.params.id, 10)
        const { status, checklist, result } = req.body

        if (role !== 'admin' && role !== 'inspector') {
            res.status(403).json({ message: "Access Denied" })
            return
        }

        const isUserInspector = checklist.some((checklistObj: any) => {
            return checklistObj.inspector.id === userId;
        });

        if (!isUserInspector) {
            res.status(403).json({ message: "You are not authorized to finish this patrol. Only assigned inspectors can start the patrol." });
            return
        }


        if (!checklist || !result) {
            res.status(400).json({ message: "Invalid Data" })
            return
        }

        if (status !== 'on_going') {
            res.status(403).json({ message: "Cannot finish patrol." });
            return
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
        let json = transformKeys(updatePatrol, keyMap);

        res.status(200).json(json)
        return

    } catch (err) {
        res.status(500)
        return
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
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete patrol',
        });
        return
    }

}

export async function updatePatrolStatus(req: Request, res: Response) {
    try {
        const { patrolId, status } = req.body; // Destructure patrolId and status from the request body

        // Validate input
        if (!patrolId || !status) {
            return res.status(400).json({ message: "Patrol ID and status are required." });
        }

        // Update the patrol status in the database
        const updatedPatrol = await prisma.patrol.update({
            where: { pt_id: patrolId },
            data: { pt_status: status },
        });
        let result = transformKeys(updatedPatrol, keyMap);
        res.status(200).json(result);
        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while updating the patrol status." });
        return
    }
}

export async function getPendingPatrols(req: Request, res: Response) {
    try {
        const pendingPatrols = await prisma.patrol.findMany({
            where: {
                pt_status: 'pending'
            },
            select: {
                pt_id: true,
                pt_date: true,
                pt_status: true,
            }
        });


        let result = transformKeys(pendingPatrols, keyMap);
        res.status(200).json(result);
        return

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        return
    }
}

export async function commentPatrol(req: Request, res: Response) {
    try {
        const role = (req as any).user.role;
        const userId = (req as any).user.userId;

        // ตรวจสอบสิทธิ์ว่าเป็น Inspector หรือไม่
        if (role !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Inspectors only" });
            return
        }

        // รับข้อมูลจาก request body
        const { patrolId, message, checklist, patrolResultId } = req.body;

        // ตรวจสอบว่าข้อมูลที่ส่งมาครบถ้วน
        if (!patrolId || !message || !checklist || !patrolResultId) {
            res.status(400).json({ message: "Bad Request: Missing required fields" });
            return
        }

        // ตรวจสอบว่าผู้ใช้เกี่ยวข้องกับ Patrol นี้หรือไม่
        const validPatrol = await prisma.patrol.findUnique({
            where: {
                pt_id: parseInt(patrolId, 10),
                patrolChecklist: {
                    some: {
                        ptcl_us_id: userId,
                    }
                }
            }
        });
        if (!validPatrol) {
            res.status(404).json({ message: "Patrol or checklist not found" });
            return
        }

        // รับ message เข้ามา และเชื่อมกับ PatrolResult
        const newComment = await prisma.comment.create({
            data: {
                cm_message: message,
                cm_us_id: userId,
                cm_pr_id: patrolResultId,
                cm_timestamp: new Date()
            }
        });

        // ส่งข้อมูลคอมเมนต์พร้อมวันที่และเวลาที่บันทึกกลับไป
        let result = transformKeys(newComment, keyMap);
        res.status(201).json(result);
        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
        return
    }
}

export async function getCommentPatrol(req: Request, res: Response) {
    try {
        const commentId = parseInt(req.params.id, 10);

        const comments = await prisma.comment.findMany({
            where: {
                cm_id: commentId
            }
        });

        let result = transformKeys(comments, keyMap);
        res.status(200).json(result);
        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
        return
    }
}

// ฟังก์ชันสำหรับตรวจสอบและอัปเดต patrols ที่มีสถานะ pending
export async function checkAndUpdatePendingPatrols() {
    try {
        const response = await axios.get(`${process.env.SERVER_URL}/patrols/pending`);
        const patrols = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const patrol of patrols) {
            const patrolDate = new Date(patrol.date);
            patrolDate.setHours(0, 0, 0, 0);

            if (patrolDate.getTime() === today.getTime()) {
                try {
                    await axios.put(`${process.env.SERVER_URL}/patrol/${patrol.id}/status`, {
                        patrolId: patrol.id,
                        status: "scheduled"
                    });
                    console.log(`Patrol ${patrol.id} status updated to "on_going".`);
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error(`Error updating patrol ${patrol.id}:`, error.response?.data || error.message);
                    } else {
                        console.error(`Unknown error updating patrol ${patrol.id}:`, error);
                    }
                }
            }
        }

        console.log("Checked and updated pending patrols for today.");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching patrol:", error.response?.data || error.message);
        } else {
            console.error("Unknown error fetching or updating patrols:", error);
        }
    }
}

// ฟังก์ชันสำหรับ schedule การ update status ของ patrol ทุกเที่ยงคืน
export function schedulePatrolStatusUpdate() {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

    setTimeout(() => {
        checkAndUpdatePendingPatrols();
        setInterval(checkAndUpdatePendingPatrols, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
}