import { prisma } from "@Utils/database.js";
import { Request, Response } from "express";
import axios from "axios";
import { createNotification } from "@Controllers/util-controller.js";
import { NotificationType, PatrolStatus } from "@prisma/client";
import transformKeys, { keyMap } from "@Utils/key-map.js";

export async function getPatrol(req: Request, res: Response) {
  try {
    const includePreset = req.query.preset === "true";
    const includeResult = req.query.result === "true";

    const role = (req as any).user.role;
    const userId = (req as any).user.userId;
    const patrolId = parseInt(req.params.id, 10);

    if (role !== "admin" && role !== "inspector") {
      res
        .status(403)
        .json({ message: "Access Denied: Admins or Inspectors only" });
      return;
    }

    let patrol: any;

    patrol = await prisma.patrol.findFirst({
      where: {
        pt_id: patrolId,
        patrolChecklist: {
          some: {
            ptcl_us_id: userId,
          },
        },
      },
      include: {
        preset: includePreset
          ? {
              select: {
                ps_id: true,
                ps_title: true,
                ps_description: true,
              },
            }
          : undefined,
        patrolChecklist: {
          include: {
            checklist: {
              select: {
                cl_id: true,
                cl_title: true,
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
                                    pf_name: true,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            inspector: {
              include: {
                profile: {
                  include: {
                    image: true,
                  },
                },
              },
            },
          },
        },
        result: includeResult
          ? {
              include: {
                defects: true,
                comment: {
                  include: {
                    user: {
                      select: {
                        us_id: true,
                        us_email: true,
                        us_department: true,
                        us_role: true,
                        profile: {
                          select: {
                            pf_name: true,
                            image: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            }
          : undefined,
      },
    });

    if (!patrol) {
      res.status(404);
      return;
    }
    let result = transformKeys(patrol, keyMap);

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function getAllPatrols(req: Request, res: Response) {
  try {
    const filterStatus = req.query.status as PatrolStatus | undefined;

    const role = (req as any).user.role;
    const userId = (req as any).user.userId;
    if (role !== "admin" && role !== "inspector") {
      res.status(403).json({ message: "Access Denied: Admins only" });
      return;
    }
    let allPatrols: any;

    allPatrols = await prisma.patrol.findMany({
      where: {
        pt_status: filterStatus,
        patrolChecklist: {
          some: {
            ptcl_us_id: userId,
          },
        },
      },
      select: {
        pt_id: true,
        pt_date: true,
        pt_status: true,
        preset: {
          select: {
            ps_title: true,
          },
        },
        patrolChecklist: {
          include: {
            checklist: {
              select: {
                cl_id: true,
                cl_title: true,
                item: {
                  include: {
                    itemZone: {
                      select: {
                        zone: {
                          select: {
                            ze_id: true,
                            ze_name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            inspector: {
              select: {
                us_id: true,
                us_email: true,
                profile: {
                  include: {
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    let result = allPatrols.map((patrol: any) => transformKeys(patrol, keyMap));

    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).json(error);
    return;
  }
}

export async function createPatrol(req: Request, res: Response) {
  try {
    const userRole = (req as any).user.role;
    if (userRole !== "admin" && userRole !== "inspector") {
      res.status(403).json({ message: "Access Denied: Admins only" });
      return;
    }

    const { date, presetId, checklists } = req.body;

    if (!date || !presetId || !checklists) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const patrolDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    patrolDate.setHours(0, 0, 0, 0);

    const status =
      patrolDate.getTime() === today.getTime() ? "scheduled" : "pending";

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
        continue;
      }

      await prisma.patrolChecklist.create({
        data: {
          ptcl_pt_id: newPatrol.pt_id,
          ptcl_cl_id: checklistId,
          ptcl_us_id: userId,
        },
      });

      if (!notifiedInspectors.has(userId)) {
        const message = `patrol_assigned-${new Date(patrolDate).toISOString()}`;
        await createNotification({
          nt_message: message,
          nt_type: "request" as NotificationType,
          nt_url: `/patrol/${newPatrol.pt_id}`,
          nt_us_id: userId,
        });

        notifiedInspectors.add(userId);
      }
    }
    let result = transformKeys(newPatrol, keyMap);
    res.status(201).json(result);
  } catch (error) {
     console.error(error)
  }
}

export async function startPatrol(req: Request, res: Response) {
  try {
    const role = (req as any).user.role;
    const userId = (req as any).user.userId;
    const patrolId = parseInt(req.params.id, 10);
    const { status, checklist } = req.body;

    const isUserInspector = checklist.some((checklistObj: any) => {
      return checklistObj.inspector.id === userId;
    });

    if (!isUserInspector) {
      res.status(403).json({
        message:
          "You are not authorized to start this patrol. Only assigned inspectors can start the patrol.",
      });
      return;
    }

    if (role !== "admin" && role !== "inspector") {
      res.status(403).json({ message: "Access Denied" });
      return;
    }

    if (!status || !checklist) {
      res.status(400);
      return;
    }

    if (status !== "scheduled") {
      res.status(403).json({ message: "Cannot start patrol." });
      return;
    }

    const updatePatrol = await prisma.patrol.update({
      where: {
        pt_id: patrolId,
      },
      data: {
        pt_status: "on_going",
        pt_start_time: new Date(),
      },
    });

    const notifiedInspectors = new Set<number>();

    for (const checklistObj of checklist) {
      const inspectorId = checklistObj.inspector.id;

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
          if (!notifiedInspectors.has(inspectorId)) {
            const message = `start_patrol`;
            await createNotification({
              nt_message: message,
              nt_type: "information" as NotificationType,
              nt_url: `/patrol/${updatePatrol.pt_id}`,
              nt_us_id: inspectorId,
            });

            notifiedInspectors.add(inspectorId);
          }
        }
      }
    }

    let result = transformKeys(updatePatrol, keyMap);
    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).json(error);
    return;
  }
}

export async function finishPatrol(req: Request, res: Response) {
  try {
    const role = (req as any).user.role;
    const userId = (req as any).user.userId;
    const patrolId = parseInt(req.params.id, 10);
    const { status, checklist, result, startTime } = req.body;

    if (role !== "admin" && role !== "inspector") {
      res.status(403).json({ message: "Access Denied" });
      return;
    }

    const isUserInspector = checklist.some((checklistObj: any) => {
      return checklistObj.inspector.id === userId;
    });

    if (!isUserInspector) {
      res.status(403).json({
        message:
          "You are not authorized to finish this patrol. Only assigned inspectors can start the patrol.",
      });
      return;
    }

    if (!checklist || !result) {
      res.status(400).json({ message: "Invalid Data" });
      return;
    }

    if (status !== "on_going") {
      res.status(403).json({ message: "Cannot finish patrol." });
      return;
    }
    const duration = calculateDuration(startTime);

    const updatePatrol = await prisma.patrol.update({
      where: {
        pt_id: patrolId,
      },
      data: {
        pt_status: "completed",
        pt_end_time: new Date(),
        pt_duration: duration,
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

    const notifiedInspectors = new Set<number>();
    for (const checklistObj of checklist) {
      const inspectorId = checklistObj.inspector.id;

      if (!notifiedInspectors.has(inspectorId)) {
        const message = `finish_patrol`;
        await createNotification({
          nt_message: message,
          nt_type: "information" as NotificationType,
          nt_url: `/patrol/${updatePatrol.pt_id}`,
          nt_us_id: inspectorId,
        });
        notifiedInspectors.add(inspectorId);
      }
    }

    let json = transformKeys(updatePatrol, keyMap);

    res.status(200).json(json);
    return;
  } catch (error) {
    res.status(500).json(error);
    return;
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
      },
    });

    await prisma.patrol.delete({
      where: {
        pt_id: patrolId,
      },
    });

    res.status(200).json({
      message: "Patrol and related records successfully deleted",
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete patrol",
    });
    return;
  }
}

export async function updatePatrolStatus(req: Request, res: Response) {
  try {
    const { patrolId, status } = req.body; // Destructure patrolId and status from the request body

    // Validate input
    if (!patrolId || !status) {
      return res
        .status(400)
        .json({ message: "Patrol ID and status are required." });
    }

    // Update the patrol status in the database
    const updatedPatrol = await prisma.patrol.update({
      where: { pt_id: patrolId },
      data: { pt_status: status },
    });
    let result = transformKeys(updatedPatrol, keyMap);
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the patrol status." });
    return;
  }
}

export async function getAllPatrolDefect(req: Request, res: Response) {
  try {
    const role = (req as any).user.role;
    const userId = (req as any).user.userId;

    if (role !== "admin" && role !== "inspector") {
      res
        .status(403)
        .json({ message: "Access Denied: Admins or Inspectors only" });
      return;
    }

    const patrolId = parseInt(req.params.id, 10);
    const validPatrol = await prisma.patrol.findFirst({
      where: {
        pt_id: patrolId,
        patrolChecklist: {
          some: {
            ptcl_us_id: userId,
          },
        },
      },
    });

    if (!validPatrol) {
      res
        .status(404)
        .json({ message: "You are not associated with this Patrol" });
      return;
    }

    const defects = await prisma.defect.findMany({
      where: {
        patrolResult: {
          pr_pt_id: patrolId,
        },
      },
      include: {
        patrolResult: {
          select: {
            pr_itze_ze_id: true,
          },
        },
        image: {
          select: {
            image: {
              select: {
                im_id: true,
                im_path: true,
                user: true,
              },
            },
          },
        },
      },
    });

    let result = defects.map((defect: any) => transformKeys(defect, keyMap));
    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).send(error);
    return;
  }
}

export async function commentPatrol(req: Request, res: Response) {
  try {
    const role = (req as any).user.role;
    const userId = (req as any).user.userId;
    const patrolId = parseInt(req.params.id, 10);
    // ตรวจสอบสิทธิ์ว่าเป็น Inspector หรือไม่
    if (role !== "inspector") {
      res.status(403).json({ message: "Access Denied: Inspectors only" });
      return;
    }

    // รับข้อมูลจาก request body
    const { message, patrolResultId } = req.body;

    // ตรวจสอบว่าข้อมูลที่ส่งมาครบถ้วน
    if (!message || !patrolResultId) {
      res.status(400).json({ message: "Bad Request: Missing required fields" });
      return;
    }

    // ตรวจสอบว่าผู้ใช้เกี่ยวข้องกับ Patrol นี้หรือไม่
    const validPatrol = await prisma.patrol.findUnique({
      where: {
        pt_id: patrolId,
        patrolChecklist: {
          some: {
            ptcl_us_id: userId,
          },
        },
      },
    });
    if (!validPatrol) {
      res.status(404).json({ message: "Patrol or checklist not found" });
      return;
    }

    // // รับ message เข้ามา และเชื่อมกับ PatrolResult
    const newComment = await prisma.comment.create({
      data: {
        cm_message: message,
        cm_timestamp: new Date(),
        cm_us_id: userId,
        cm_pr_id: parseInt(patrolResultId, 10),
      },
    });

    // ส่งข้อมูลคอมเมนต์พร้อมวันที่และเวลาที่บันทึกกลับไป
    let result = transformKeys(newComment, keyMap);
    res.status(201).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function getCommentPatrol(req: Request, res: Response) {
  try {
    const commentId = parseInt(req.params.id, 10);

    const comments = await prisma.comment.findMany({
      where: {
        cm_id: commentId,
      },
    });

    let result = transformKeys(comments, keyMap);
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

// ฟังก์ชันสำหรับตรวจสอบและอัปเดต patrols ที่มีสถานะ pending
export async function checkAndUpdatePendingPatrols() {
  try {
    const response = await axios.get(
      `${process.env.SERVER_URL}/patrols?status=pending`
    );
    const patrols = response.data;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const patrol of patrols) {
      const patrolDate = new Date(patrol.date);
      patrolDate.setHours(0, 0, 0, 0);

      if (patrolDate.getTime() === today.getTime()) {
        try {
          await axios.put(
            `${process.env.SERVER_URL}/patrol/${patrol.id}/status`,
            {
              patrolId: patrol.id,
              status: "scheduled",
            }
          );
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(
              `Error updating patrol ${patrol.id}:`,
              error.response?.data || error.message
            );
          } else {
            console.error(`Unknown error updating patrol ${patrol.id}:`, error);
          }
        }
      }
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching patrol:",
        error.response?.data || error.message
      );
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

// ฟังก์ชันสำหรับ คำนวณ Duration ของ patrol
const calculateDuration = (startTime: string): string => {
  // แปลง startTime เป็น Date object
  const start = new Date(startTime);

  // คำนวณเวลาปัจจุบัน
  const end = new Date();

  // คำนวณความแตกต่างในหน่วยมิลลิวินาที
  const durationMs = end.getTime() - start.getTime();

  // แปลงมิลลิวินาทีเป็นหน่วยชั่วโมง นาที และวินาที
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

  // แสดงผลในรูปแบบที่อ่านง่าย เช่น "2h 15m 30s"
  return `${hours}h ${minutes}m ${seconds}s`;
};
