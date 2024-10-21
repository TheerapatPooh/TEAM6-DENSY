
import { Defect } from '@prisma/client'
import { prisma } from '../Utils/database'
import { Request, Response } from 'express'
import axios from 'axios';
import { createNotification } from './util-controller';
import { NotificationType } from '@prisma/client';
import { tr } from '@faker-js/faker/.';
import path from 'path';

export async function getPatrol(req: Request, res: Response) {
    try {
        const role = (req as any).user.role
        const userId = (req as any).user.userId
        const patrolId = parseInt(req.params.id, 10)

        if (role !== 'admin' && role !== 'inspector') {
            return res.status(403).json({ message: "Access Denied: Admins or Inspectors only" })
        }

        let patrol: any

        if (role === 'inspector' || role === 'admin') {
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
                    patrol_result: {
                        include: {
                            defects: {
                                include: {
                                    image: {
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
                    imagePath: checklist.inspector.profile?.pf_image?.im_path ?? null
                },
                item: checklist.checklist.item.map((item: any) => ({
                    id: item.it_id,
                    name: item.it_name,
                    type: item.it_type,
                    zone: item.item_zone.map((zone: any) => ({
                        id: zone.zone.ze_id,
                        name: zone.zone.ze_name,
                        supervisor: {
                            id: zone.zone.supervisor.us_id,
                            email: zone.zone.supervisor.us_email,
                            department: zone.zone.supervisor.us_department,
                            profile: {
                                name: zone.zone.supervisor.profile.pf_name,
                                tel: zone.zone.supervisor.profile.pf_tel,
                                image: zone.zone.supervisor.profile.pf_image
                            }
                        }
                    })),
                })),
            })),
            result: patrol.patrol_result.map((result: any) => ({
                id: result.pr_id,
                status: result.pr_status,
                itemId: result.pr_itze_it_id,
                zoneId: result.pr_itze_ze_id,
                defect: result.defects.map((defect: any) => ({
                    id: defect.df_id,
                    name: defect.df_name,
                    description: defect.df_description,
                    type: defect.df_type,
                    status: defect.df_status,
                    timestamp: defect.df_timestamp,
                    imageByInspector: defect.image
                        .filter((image: any) => image.image.im_update_by === defect.df_us_id)
                        .map((image: any) => ({
                            path: image.image.im_path,
                        })) || null, 

                    imageBySupervisor: defect.image
                        .filter((image: any) => image.image.im_update_by !== defect.df_us_id) 
                        .map((image: any) => ({
                            path: image.image.im_path,
                        })) || null  
                })),
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
                    patrol_result: {
                        include: {
                            defects: true
                        }
                    }
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
                    patrol_result: {
                        include: {
                            defects: true
                        }
                    }
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
                itemId: result.pr_itze_id,
                zoneId: result.pr_itze_ze_id,
                defect: result.defects.map((defect: Defect) => ({
                    id: defect.df_id,
                    name: defect.df_name,
                    description: defect.df_description,
                    type: defect.df_type,
                    status: defect.df_status,
                    timestamp: defect.df_timestamp
                })),
                
            })) ?? [],
        }))
        res.status(200).json(result)

    } catch (error) {
        res.status(500)
    }
}

export async function createPatrol(req: Request, res: Response) {
    try {
        const userRole = (req as any).user.role;
        if (userRole !== 'admin' && userRole !== 'inspector') {
            return res.status(403).json({ message: "Access Denied: Admins only" });
        }

        const { date, presetId, checklists } = req.body;

        if (!date || !presetId || !checklists) {
            return res.status(400).json({ message: "Missing required fields" });
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
            const { checklistId, inspectorId } = checklist;

            if (!checklistId || !inspectorId) {
                continue
            }

            await prisma.patrolChecklist.create({
                data: {
                    ptcl_pt_id: newPatrol.pt_id,
                    ptcl_cl_id: checklistId,
                    ptcl_us_id: inspectorId,
                },
            });

            if (!notifiedInspectors.has(inspectorId)) {
                const message = `You have been assigned to a patrol scheduled for ${new Date(date).toLocaleDateString()}.`;
                await createNotification({
                    nt_message: message,
                    nt_type: 'request' as NotificationType,
                    nt_url: `/patrol/${newPatrol.pt_id}`,
                    nt_us_id: inspectorId,
                });

                notifiedInspectors.add(inspectorId);
            }
        }

        res.status(201).json(newPatrol);

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
                            pr_itze_it_id: itemId,
                            pr_itze_ze_id: zoneId,
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

        res.status(200).json(updatedPatrol);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while updating the patrol status." });
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

        const result = pendingPatrols.map((patrol: any) => ({
            id: patrol.pt_id,
            date: patrol.pt_date,
            status: patrol.pt_status,
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function commentPatrol(req: Request, res: Response) {
    try {
        const role = (req as any).user.role;
        const userId = (req as any).user.userId;

        // ตรวจสอบสิทธิ์ว่าเป็น Inspector หรือไม่
        if (role !== 'inspector') {
            return res.status(403).json({ message: "Access Denied: Inspectors only" });
        }

        // รับข้อมูลจาก request body
        const { patrolId, message, checklist, patrolResultId } = req.body;

        // ตรวจสอบว่าข้อมูลที่ส่งมาครบถ้วน
        if (!patrolId || !message || !checklist || !patrolResultId) {
            return res.status(400).json({ message: "Bad Request: Missing required fields" });
        }

        // ตรวจสอบว่าผู้ใช้เกี่ยวข้องกับ Patrol นี้หรือไม่
        const validPatrol = await prisma.patrol.findUnique({
            where: {
                pt_id: parseInt(patrolId, 10),
                checklist: {
                    some: {
                        ptcl_us_id: userId,
                    }
                }
            }
        });
        if (!validPatrol) {
            return res.status(404).json({ message: "Patrol or checklist not found" });
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
        res.status(201).json({
            userId: newComment.cm_us_id,
            comment: newComment.cm_message,
            timestamp: newComment.cm_timestamp
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
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
        const result = comments.map(comment => ({
            id: comment.cm_us_id,
            message: comment.cm_message,
            timestamp: comment.cm_timestamp,
            userId: comment.cm_us_id,
            patrolResultId: comment.cm_pr_id
        }))
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
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