import prisma from "@Utils/database.js";
import { Request, Response } from "express";
import axios from "axios";
import { createNotification } from "@Controllers/util-controller.js";
import { NotificationType, PatrolStatus } from "@prisma/client";

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Patrol ตาม ID
 * Input:
 * - req.query: { preset: "true" | "false", result: "true" | "false" } (optional)
 * - req.params.id: number (ID ของ Patrol ที่ต้องการดึงข้อมูล)
 * - req.user: { role: String, userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON object ข้อมูล Patrol รวมถึง preset และ result หากร้องขอ
**/
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
        id: patrolId,
        patrolChecklists: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        preset: includePreset
          ? {
            select: {
              id: true,
              title: true,
              description: true,
            },
          }
          : undefined,
        patrolChecklists: {
          include: {
            checklist: {
              select: {
                id: true,
                title: true,
                items: {
                  include: {
                    itemZones: {
                      select: {
                        zone: {
                          select: {
                            id: true,
                            name: true,
                            supervisor: {
                              select: {
                                id: true,
                                profile: {
                                  select: {
                                    name: true,
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
        results: includeResult
          ? {
            include: {
              defects: true,
              comments: {
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      department: true,
                      role: true,
                      profile: {
                        select: {
                          name: true,
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
    let result = patrol;

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Patrol ทั้งหมดตามสถานะ
 * Input:
 * - req.query: { status: String | undefined } (สถานะของ Patrol เช่น "pending", "scheduled")
 * - req.user: { role: String, userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON array ข้อมูล Patrol และข้อมูลที่เกี่ยวข้อง
**/
export async function getAllPatrols(req: Request, res: Response) {
  try {
    const filterStatus = req.query.status as PatrolStatus | undefined;

    const role = (req as any).user.role;
    const userId = (req as any).user.userId;
    if (role !== "admin" && role !== "inspector") {
      res.status(403).json({ message: "Access Denied: Admins or Inspectors only" });
      return;
    }
    let allPatrols: any;

    allPatrols = await prisma.patrol.findMany({
      where: {
        status: filterStatus,
        patrolChecklists: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        date: true,
        status: true,
        preset: {
          select: {
            title: true,
          },
        },
        patrolChecklists: {
          include: {
            checklist: {
              select: {
                id: true,
                title: true,
                items: {
                  include: {
                    itemZones: {
                      select: {
                        zone: {
                          select: {
                            id: true,
                            name: true,
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
                id: true,
                email: true,
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

    let result = allPatrols;

    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสร้าง Patrol ใหม่
 * Input:
 * - req.body: {
 *     date: String,
 *     presetId: number,
 *     checklists: Array<{ checklistId: number, userId: number }>
 *   } (ข้อมูล Patrol ที่ต้องการสร้าง)
 * - req.user: { role: String } (บทบาทของผู้ใช้งาน เช่น "admin", "inspector")
 * Output: JSON object ข้อมูล Patrol ที่ถูกสร้าง
**/
export async function createPatrol(req: Request, res: Response) {
  try {
    const userRole = (req as any).user.role;
    if (userRole !== "admin" && userRole !== "inspector") {
      res.status(403).json({ message: "Access Denied: Admins or Inspector only" });
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
        date: patrolDate,
        status: status,
        presetId: parseInt(presetId, 10),
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
          patrolId: newPatrol.id,
          checklistId: checklistId,
          userId: userId,
        },
      });

      if (!notifiedInspectors.has(userId)) {
        const message = `patrol_assigned-${new Date(patrolDate).toISOString()}`;
        await createNotification({
          message: message,
          type: "request" as NotificationType,
          url: `/patrol/${newPatrol.id}`,
          userId: userId,
        });

        notifiedInspectors.add(userId);
      }
    }
    let result = newPatrol;
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error)
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับเริ่มต้น Patrol
 * Input:
 * - req.params.id: number (ID ของ Patrol ที่ต้องการเริ่ม)
 * - req.body: {
 *     status: String,
 *     checklists: Array<{ checklist: { items: Array<{ itemZones: Array<{ zone: { id: number } }> }> }, inspector: { id: number } }>
 *   } (สถานะและรายการ Checklist)
 * - req.user: { role: String, userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON object ข้อมูล Patrol หลังจากเริ่มต้น
**/
export async function startPatrol(req: Request, res: Response) {
  try {
    const role = (req as any).user.role;
    const userId = (req as any).user.userId;
    const patrolId = parseInt(req.params.id, 10);
    const { status, checklists } = req.body;

    const isUserInspector = checklists.some((checklistObj: any) => {
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

    if (!status || !checklists) {
      res.status(400);
      return;
    }

    if (status !== "scheduled") {
      res.status(403).json({ message: "Cannot start patrol." });
      return;
    }

    const updatePatrol = await prisma.patrol.update({
      where: {
        id: patrolId,
      },
      data: {
        status: "on_going",
        startTime: new Date(),
      },
    });

    const notifiedInspectors = new Set<number>();

    for (const checklistObj of checklists) {
      const inspectorId = checklistObj.inspector.id;

      for (const items of checklistObj.checklist.items) {
        for (const zones of items.itemZones) {
          await prisma.patrolResult.create({
            data: {
              status: null,
              itemId: items.id,
              zoneId: zones.zone.id,
              patrolId: updatePatrol.id,
            },
          });
          if (!notifiedInspectors.has(inspectorId)) {
            const message = `start_patrol`;
            await createNotification({
              message: message,
              type: "information" as NotificationType,
              url: `/patrol/${updatePatrol.id}`,
              userId: inspectorId,
            });

            notifiedInspectors.add(inspectorId);
          }
        }
      }
    }

    let result = updatePatrol;
    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).json(error);
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสิ้นสุด Patrol
 * Input:
 * - req.params.id: number (ID ของ Patrol ที่ต้องการสิ้นสุด)
 * - req.body: {
 *     status: String,
 *     checklist: Array<{ inspector: { id: number } }>,
 *     result: Array<{ id: number, status: String }>,
 *     startTime: String
 *   } (สถานะ, Checklist, ผลลัพธ์, และเวลาเริ่มต้น)
 * - req.user: { role: String, userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON object ข้อมูล Patrol หลังจากสิ้นสุด
**/
export async function finishPatrol(req: Request, res: Response) {
  try {
    const role = (req as any).user.role;
    const userId = (req as any).user.userId;
    const patrolId = parseInt(req.params.id, 10);
    const { status, checklists, results, startTime } = req.body;

    if (role !== "admin" && role !== "inspector") {
      res.status(403).json({ message: "Access Denied" });
      return;
    }

    const isUserInspector = checklists.some((checklistObj: any) => {
      return checklistObj.inspector.id === userId;
    });

    if (!isUserInspector) {
      res.status(403).json({
        message:
          "You are not authorized to finish this patrol. Only assigned inspectors can start the patrol.",
      });
      return;
    }

    if (!checklists || !results) {
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
        id: patrolId,
      },
      data: {
        status: "completed",
        endTime: new Date(),
        duration: duration,
      },
    });

    for (const resultObj of results) {
      const { id, status } = resultObj;

      await prisma.patrolResult.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
      });
    }

    const notifiedInspectors = new Set<number>();
    for (const checklistObj of checklists) {
      const inspectorId = checklistObj.inspector.id;

      if (!notifiedInspectors.has(inspectorId)) {
        const message = `finish_patrol`;
        await createNotification({
          message: message,
          type: "information" as NotificationType,
          url: `/patrol/${updatePatrol.id}`,
          userId: inspectorId,
        });
        notifiedInspectors.add(inspectorId);
      }
    }

    let json = updatePatrol;

    res.status(200).json(json);
    return;
  } catch (error) {
    res.status(500).json(error);
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับลบ Patrol และข้อมูลที่เกี่ยวข้อง
 * Input:
 * - req.params.id: number (ID ของ Patrol ที่ต้องการลบ)
 * Output: JSON message ยืนยันการลบ Patrol และข้อมูลที่เกี่ยวข้องสำเร็จ
**/
export async function removePatrol(req: Request, res: Response) {
  try {
    const patrolId = parseInt(req.params.id, 10);

    await prisma.patrolChecklist.deleteMany({
      where: {
        patrolId: patrolId,
      },
    });

    await prisma.patrolResult.deleteMany({
      where: {
        patrolId: patrolId,
      },
    });

    await prisma.patrol.delete({
      where: {
        id: patrolId,
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

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Defect ทั้งหมดใน Patrol
 * Input:
 * - req.params.id: number (ID ของ Patrol)
 * - req.user: { role: String, userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON array ข้อมูล Defect และข้อมูลที่เกี่ยวข้อง
**/
export async function getAllPatrolDefects(req: Request, res: Response) {
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
        id: patrolId,
        patrolChecklists: {
          some: {
            userId: userId,
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
          patrolId: patrolId,
        },
      },
      include: {
        patrolResult: {
          select: {
            zoneId: true,
          },
        },
        images: {
          select: {
            image: {
              select: {
                id: true,
                path: true,
                user: {
                  select:{
                    id: true,
                    email: true,
                    role: true,
                    department: true,
                    createdAt: true
                  }
                },
              },
            },
          },
        },
      },
    });

    let result = defects;
    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).send(error);
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับเพิ่มความคิดเห็นใน Patrol
 * Input:
 * - req.params.id: number (ID ของ Patrol)
 * - req.body: { message: String, patrolResultId: number } (ข้อความความคิดเห็นและ ID ของผลลัพธ์)
 * - req.user: { role: String, userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON object ข้อมูลความคิดเห็นที่ถูกบันทึก
**/
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
    const validPatrol = await prisma.patrol.findFirst({
      where: {
        id: patrolId,
        patrolChecklists: {
          some: {
            userId: userId,
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
        message: message,
        timestamp: new Date(),
        userId: userId,
        patrolResultId: parseInt(patrolResultId, 10),
      },
    });

    // ส่งข้อมูลคอมเมนต์พร้อมวันที่และเวลาที่บันทึกกลับไป
    let result = newComment;
    res.status(201).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับตรวจสอบและอัปเดตสถานะ Patrol ที่เป็น "pending" ให้เป็น "scheduled"
 * Input:
 * - ไม่มี Input (ฟังก์ชันทำงานอัตโนมัติ)
 * Output: ไม่มี Output ที่ส่งกลับ แต่จะทำการอัปเดตสถานะในฐานข้อมูล
**/
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

/**
 * คำอธิบาย: ฟังก์ชันสำหรับกำหนดเวลาอัปเดตสถานะของ Patrol อัตโนมัติทุกเที่ยงคืน
 * Input:
 * - ไม่มี Input
 * Output: ไม่มี Output ที่ส่งกลับ (ฟังก์ชันทำงานเบื้องหลัง)
**/
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

/**
 * คำอธิบาย: ฟังก์ชันสำหรับคำนวณระยะเวลา (Duration) ของ Patrol
 * Input:
 * - startTime: String (เวลาเริ่มต้นของ Patrol ในรูปแบบ ISO 8601)
 * Output: String (ระยะเวลาในรูปแบบ "xh ym zs" เช่น "2h 15m 30s")
**/
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

