import prisma from "@Utils/database.js";
import { Request, Response } from "express";
import { createNotification } from "@Controllers/util-controller.js";
import { NotificationType, Patrol, PatrolStatus, User } from "@prisma/client";

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Patrol ตาม ID
 * Input:
 * - req.query: { preset: "true" | "false", result: "true" | "false" } (optional)
 * - req.params.id: number (ID ของ Patrol ที่ต้องการดึงข้อมูล)
 * - req.user: { userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON object ข้อมูล Patrol รวมถึง preset และ result หากร้องขอ
**/
export async function getPatrol(req: Request, res: Response) {
  try {
    const includePreset = req.query.preset === "true";
    const includeResult = req.query.result === "true";

    const userId = (req as any).user.userId;
    const patrolId = parseInt(req.params.id, 10);
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
    res.status(500);
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Patrol ทั้งหมดตามสถานะ
 * Input:
 * - req.query: { status, preset, startDate, endDate, search } ("status", "preset", "startDate", "endDate" ใช้สำหรับ filter ข้อมูล และ search ใช้สำหรับค้นหาชื่อ inspector หรืออื่นๆ )
 * - req.user: { userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON array ข้อมูล Patrol และข้อมูลที่เกี่ยวข้อง
**/
export async function getAllPatrols(req: Request, res: Response) {
  try {
    const { status, preset, startDate, endDate, search } = req.query;
    const userId = (req as any).user.userId;
    // สร้างเงื่อนไขหลัก
    const whereConditions: any = {
      patrolChecklists: {
        some: {
          userId: userId,
        },
      }
    };

    const andConditions: any[] = [];

    // เงื่อนไขการกรองตาม status
    if (status) {
      const statusArray = (status as string).split(","); // แยกค่าด้วย comma
      const orStatusConditions = statusArray.map((s) => ({ status: s })); // สร้าง array ของ OR เงื่อนไข

      andConditions.push({ OR: orStatusConditions });
    }

    // เงื่อนไขการกรองตาม preset
    if (preset) {
      andConditions.push({
        preset: {
          title: { contains: preset as string }
        }
      });
    }

    // เงื่อนไขการกรองตามช่วงเวลา
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        andConditions.push({
          date: {
            gte: start,
            lte: end,
          },
        });
      } else {
        console.error('Invalid date range:', startDate, endDate);
      }
    }

    // เงื่อนไขการค้นหา (search)
    if (search) {
      const searchId = parseInt(search as string, 10);

      function mapSearchToStatus(search: string): PatrolStatus | null {
        const searchLower = search.toLowerCase();

        // ตรวจสอบความใกล้เคียงกับค่าของ PatrolStatus
        if (searchLower.startsWith('p')) {
          return PatrolStatus.pending;
        } else if (searchLower.startsWith('s')) {
          return PatrolStatus.scheduled;
        } else if (searchLower.startsWith('o')) {
          return PatrolStatus.on_going;
        } else if (searchLower.startsWith('c')) {
          return PatrolStatus.completed;
        }

        // ถ้าไม่มีค่าใดที่ตรงกับการค้นหา
        return null;
      }

      const mappedStatus = mapSearchToStatus(search as string);

      const orConditions = [];

      if (!isNaN(searchId)) {
        orConditions.push({ id: searchId });
      }

      // ถ้า mappedStatus มีค่า (ค้นหาตรงกับสถานะ)
      if (mappedStatus) {
        orConditions.push({ status: mappedStatus as PatrolStatus });
      }

      // ถ้ามีค่า preset title
      orConditions.push({
        preset: {
          title: {
            contains: search as string,
          },
        },
      });

      orConditions.push({
        patrolChecklists: {
          some: {
            inspector: {
              profile: {
                name: {
                  contains: search as string,
                },
              },
            },
          },
        },
      });

      // ถ้ามีเงื่อนไขใน OR ให้เพิ่มเข้าไปใน AND
      if (orConditions.length > 0) {
        andConditions.push({ OR: orConditions });
      }
    }

    // ถ้ามีเงื่อนไขเพิ่มเติมให้เพิ่มเข้าไปใน AND
    if (andConditions.length > 0) {
      whereConditions.AND = andConditions;
    }

    // บันทึก query ที่สร้างขึ้นสำหรับการดีบัก
    // console.log('Generated Query:', JSON.stringify(whereConditions, null, 2));

    const allPatrols = await prisma.patrol.findMany({
      where: whereConditions,
      select: {
        id: true,
        date: true,
        status: true,
        preset: {
          select: {
            id: true,
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

    // จัดกลุ่ม patrols โดยใช้ id และรวม Inspectors และ Item Counts
    const groupedPatrols: Record<number, any> = {};

    allPatrols.forEach(patrol => {
      if (!groupedPatrols[patrol.id]) {
        groupedPatrols[patrol.id] = {
          id: patrol.id,
          date: patrol.date,
          status: patrol.status,
          preset: patrol.preset,
          itemCounts: {},
          inspectors: []
        };
      }

      let count = 0
      patrol.patrolChecklists.forEach(patrolChecklist => {
        // นับจำนวน item แต่ละประเภท
        patrolChecklist.checklist.items.forEach(item => {
          item.itemZones.forEach(itemZone => {
            count++
          })
        });
        groupedPatrols[patrol.id].itemCounts = count;

        // เพิ่ม Inspector ถ้ายังไม่มีในรายการ
        const inspector = patrolChecklist.inspector;
        if (inspector && !groupedPatrols[patrol.id].inspectors.some((ins: any) => ins.id === inspector.id)) {
          groupedPatrols[patrol.id].inspectors.push(inspector);
        }
      });
    });

    // แปลงกลุ่ม patrols เป็น array
    const result = Object.values(groupedPatrols)

    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500);
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
 * Output: JSON object ข้อมูล Patrol ที่ถูกสร้าง
**/
export async function createPatrol(req: Request, res: Response) {
  try {
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

    // Fetch the created patrol with the desired format
    const createdPatrol = await prisma.patrol.findUnique({
      where: { id: newPatrol.id },
      select: {
        id: true,
        date: true,
        status: true,
        preset: {
          select: {
            id: true,
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

    if (createdPatrol) {
      // Process data to group inspectors and count items
      const result = {
        id: createdPatrol.id,
        date: createdPatrol.date,
        status: createdPatrol.status,
        preset: createdPatrol.preset,
        itemCounts: 0,
        inspectors: [] as any,
      };

      // Count items and group inspectors
      createdPatrol.patrolChecklists.forEach((patrolChecklist) => {
        // Count items
        patrolChecklist.checklist.items.forEach((item) => {
          result.itemCounts += item.itemZones.length;
        });

        // Add unique inspectors
        const inspector = patrolChecklist.inspector;
        if (
          inspector &&
          !result.inspectors.some((ins: User) => ins.id === inspector.id)
        ) {
          result.inspectors.push(inspector); // TypeScript จะเข้าใจประเภท inspector ชัดเจน
        }


      });
      res.status(201).json(result);
    }

  } catch (error) {
    res.status(500);
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
 * - req.user: { userId: number } (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON object ข้อมูล Patrol หลังจากเริ่มต้น
**/
export async function startPatrol(req: Request, res: Response) {
  try {
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

    if (!status || !checklists) {
      res.status(400);
      return;
    }

    if (status !== "scheduled") {
      res.status(400)
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
    res.status(500);
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
 * - req.user: { userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON object ข้อมูล Patrol หลังจากสิ้นสุด
**/
export async function finishPatrol(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const patrolId = parseInt(req.params.id, 10);
    const { status, checklists, results, startTime } = req.body;

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
      res.status(400).json({ message: "Cannot finish patrol." });
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
    res.status(500);
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
    res.status(500)
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Defect ทั้งหมดใน Patrol
 * Input:
 * - req.params.id: number (ID ของ Patrol)
 * - req.user: { userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON array ข้อมูล Defect และข้อมูลที่เกี่ยวข้อง
**/
export async function getAllPatrolDefects(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    if (req.params.id) {
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
          .status(403)
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
              itemZone: {
                select: {
                  zone: {
                    select: {
                      name: true,
                      supervisor: {
                        select: {
                          id: true,
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
              }
            },
          },
          images: {
            select: {
              image: {
                select: {
                  id: true,
                  path: true,
                  user: {
                    select: {
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
    }
    else {

      const defects = await prisma.defect.findMany({
        where: {
          userId: userId,
        },
        include: {
          patrolResult: {
            select: {
              patrol: {
                select: {
                  id: true,
                  preset: {
                    select: {
                      title: true
                    }
                  }
                }
              },
              zoneId: true,
              itemZone: {
                select: {
                  zone: {
                    select: {
                      name: true,
                      supervisor: {
                        select: {
                          id: true,
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
              }
            },
          },
          images: {
            select: {
              image: {
                select: {
                  id: true,
                  path: true,
                  user: {
                    select: {
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
    }
  } catch (error) {
    res.status(500)
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับเพิ่มความคิดเห็นใน Patrol
 * Input:
 * - req.params.id: number (ID ของ Patrol)
 * - req.body: { message: String, patrolResultId: number } (ข้อความความคิดเห็นและ ID ของผลลัพธ์)
 * - req.user: { userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON object ข้อมูลความคิดเห็นที่ถูกบันทึก
**/
export async function commentPatrol(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const patrolId = parseInt(req.params.id, 10);
    // รับข้อมูลจาก request body
    const { message, patrolResultId, supervisorId } = req.body;

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
      res.status(403).json({ message: "Patrol or checklist not found" });
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

    const notification = `new_comment`;
    await createNotification({
      message: notification,
      type: "request" as NotificationType,
      url: `/comment/${newComment.id}`,
      userId: supervisorId,
    });

    // ส่งข้อมูลคอมเมนต์พร้อมวันที่และเวลาที่บันทึกกลับไป
    let result = newComment;
    res.status(201).json(result);
    return;
  } catch (error) {
    res.status(500)
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
    const patrols = await prisma.patrol.findMany({
      where: {
        status: "pending" as PatrolStatus,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const patrol of patrols) {
      const patrolDate = new Date(patrol.date);
      patrolDate.setHours(0, 0, 0, 0);

      if (patrolDate.getTime() === today.getTime()) {
        try {
          await prisma.patrol.update({
            where: {
              id: patrol.id,
            },
            data: {
              status: "scheduled",
            },
          });
        } catch (error) {
          console.error(`Error updating patrol ${patrol.id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching or updating patrols:", error);
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

