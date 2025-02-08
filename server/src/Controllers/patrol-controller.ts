import prisma from "@Utils/database.js";
import { Request, Response } from "express";
import { createNotification } from "@Controllers/util-controller.js";
import { NotificationType, PatrolStatus, User } from "@prisma/client";

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Patrol ตาม ID
 * Input:
 * - req.query: { preset: boolean, result: boolean } 
 * - req.params.id: number (ID ของ Patrol ที่ต้องการดึงข้อมูล)
 * - req.user: { userId: number } (บทบาทและ ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON object ข้อมูล Patrol รวมถึง preset และ result หากร้องขอ
 **/
export async function getPatrol(req: Request, res: Response) {
  try {
    //เลือกว่าจะเอา Preset และ Result หรือไม่
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
      res.status(404).json({ message: "patrol not found" });
      return;
    }
    let result = patrol;

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({message: `Internal server error: ${error}`});
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
    // สร้างเงื่อนไขหลัก สำหรับค้นหา
    const whereConditions: any = {
      patrolChecklists: {
        some: {
          userId: userId,
        },
      },
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
          title: { contains: preset as string },
        },
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
        console.error("Invalid date range:", startDate, endDate);
      }
    }

    // เงื่อนไขการค้นหา (search)
    if (search) {
      const searchId = parseInt(search as string, 10);

      function mapSearchToStatus(search: string): PatrolStatus | null {
        const searchLower = search.toLowerCase();

        // ตรวจสอบความใกล้เคียงกับค่าของ PatrolStatus
        if (searchLower.startsWith("p")) {
          return PatrolStatus.pending;
        } else if (searchLower.startsWith("s")) {
          return PatrolStatus.scheduled;
        } else if (searchLower.startsWith("o")) {
          return PatrolStatus.on_going;
        } else if (searchLower.startsWith("c")) {
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

    allPatrols.forEach((patrol) => {
      if (!groupedPatrols[patrol.id]) {
        groupedPatrols[patrol.id] = {
          id: patrol.id,
          date: patrol.date,
          status: patrol.status,
          preset: patrol.preset,
          itemCounts: {},
          inspectors: [],
        };
      }

      let count = 0;
      patrol.patrolChecklists.forEach((patrolChecklist) => {
        // นับจำนวน item แต่ละประเภท
        patrolChecklist.checklist.items.forEach((item) => {
          item.itemZones.forEach((_itemZone) => {
            count++;
          });
        });
        groupedPatrols[patrol.id].itemCounts = count;

        // เพิ่ม Inspector ถ้ายังไม่มีในรายการ
        const inspector = patrolChecklist.inspector;
        if (
          inspector &&
          !groupedPatrols[patrol.id].inspectors.some(
            (ins: any) => ins.id === inspector.id
          )
        ) {
          groupedPatrols[patrol.id].inspectors.push(inspector);
        }
      });
    });

    // แปลงกลุ่ม patrols เป็น array
    const result = Object.values(groupedPatrols);

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({message: `Internal server error: ${error}`});
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Patrol Users ทั้งหมด
 * Input:
 * - req.params: { patrolId: number, }
 * Output: JSON object ข้อมูล PatrolUsers ที่ถูกสร้าง
 **/
export async function getPatrolUsers(req: Request, res: Response) {
  try {
    const patrolId = parseInt(req.params.id, 10);

    const patrol = await prisma.patrol.findUnique({
      where: {
        id: patrolId,
      },
      select: {
        patrolChecklists: {
          select: {
            inspector: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    let result: any[] = [];
    patrol?.patrolChecklists.map((pc) => {
      result.push(pc.inspector);
    });

    // ลบชื่อผู้ใช้ที่ซ้ำ
    result = result.filter(
      (user, index, self) =>
        index === self.findIndex((u) => u.username === user.username)
    );

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({message: `Internal server error: ${error}`});
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
    // เช็คว่า fields ที่สำคัญถูกส่งมาครบหรือไม่
    if (!date || !presetId || !checklists) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    // แปลงวันที่จาก string เป็น Date object
    const patrolDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ตั้งเวลาให้เป็น 00:00:00 ของวัน
    patrolDate.setHours(0, 0, 0, 0); // ตั้งเวลาให้เป็น 00:00:00 ของวันที่กำหนด
    // กำหนดสถานะของ Patrol ตามวันที่ (ถ้าวันที่เป็นวันนี้ ให้สถานะเป็น 'scheduled' ถ้าไม่ให้เป็น 'pending')
    const status =
      patrolDate.getTime() === today.getTime() ? "scheduled" : "pending";
    // สร้าง Patrol ใหม่ในฐานข้อมูล
    const newPatrol = await prisma.patrol.create({
      data: {
        date: patrolDate,
        status: status,
        presetId: parseInt(presetId, 10),
      },
    });
    // สร้าง Set สำหรับเก็บ userId ของผู้ตรวจสอบที่ได้รับการแจ้งเตือนแล้ว
    const notifiedInspectors = new Set<number>();
    // ทำการสร้าง patrolChecklist และส่งการแจ้งเตือนให้กับผู้ตรวจสอบ
    for (const checklist of checklists) {
      const { checklistId, userId } = checklist;
      // ตรวจสอบว่า checklistId และ userId มีค่าหรือไม่
      if (!checklistId || !userId) {
        continue;
      }
      // สร้างข้อมูล patrolChecklist ที่เชื่อมโยงกับ Patrol ใหม่
      await prisma.patrolChecklist.create({
        data: {
          patrolId: newPatrol.id,
          checklistId: checklistId,
          userId: userId,
        },
      });
      // ส่งการแจ้งเตือนให้กับผู้ตรวจสอบที่ยังไม่ได้รับการแจ้งเตือน
      if (!notifiedInspectors.has(userId)) {
        const message = `patrol_assigned-${new Date(patrolDate).toISOString()}`;
        await createNotification({
          message: message,
          type: "request" as NotificationType,
          url: `/patrol/${newPatrol.id}/detail`,
          userId: userId,
        });

        notifiedInspectors.add(userId);
      }
    }

    // ดึงข้อมูล Patrol ที่สร้างขึ้น พร้อมข้อมูลที่ต้องการแสดง
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
      // สร้างผลลัพธ์ที่ต้องการส่งกลับ
      const result = {
        id: createdPatrol.id,
        date: createdPatrol.date,
        status: createdPatrol.status,
        preset: createdPatrol.preset,
        itemCounts: 0,
        inspectors: [] as any,
      };

      // นับจำนวน items ใน checklists
      createdPatrol.patrolChecklists.forEach((patrolChecklist) => {
        // นับจำนวน itemZones ในแต่ละ item
        patrolChecklist.checklist.items.forEach((item) => {
          result.itemCounts += item.itemZones.length;
        });

        // เพิ่มผู้ตรวจสอบใน list ถ้ายังไม่มี
        const inspector = patrolChecklist.inspector;
        if (
          inspector &&
          !result.inspectors.some((ins: User) => ins.id === inspector.id)
        ) {
          result.inspectors.push(inspector);
        }
      });
      res.status(201).json(result);
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({message: `Internal server error: ${error}`});
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับเริ่มต้น Patrol
 * Input:
 * - req.params.id: Int (ID ของ Patrol ที่จะเริ่ม)
 * - req.body: {
 *     status: String (สถานะของ Patrol, ค่าที่ต้องการคือ 'scheduled')
 *     checklists: Array<{ inspector: { id: Int }, checklist: { items: Array<ChecklistItem> } }>
 *       (รายการตรวจสอบที่ผู้ตรวจสอบถูกมอบหมาย)
 *   }
 * - req.user: { userId: number } (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON object ข้อมูล Patrol หลังจากเริ่มต้น
 **/
export async function startPatrol(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const patrolId = parseInt(req.params.id, 10);
    const { status, checklists } = req.body;
    // เช็คว่า userId ของผู้ใช้งานที่ล็อกอินเป็นผู้ตรวจสอบใน checklists หรือไม่
    const isUserInspector = checklists.some((checklistObj: any) => {
      return checklistObj.inspector.id === userId;
    });
    // ถ้า userId ไม่ใช่ผู้ตรวจสอบที่ได้รับมอบหมาย ให้ส่งกลับ error 403
    if (!isUserInspector) {
      res.status(403).json({
        message:
          "You are not authorized to start this patrol. Only assigned inspectors can start the patrol.",
      });
      return;
    }
    // เช็คสถานะและข้อมูลที่จำเป็นใน request body
    if (!status || !checklists || status !== "scheduled") {
      res.status(400);
      return;
    }
    // อัปเดตสถานะของ Patrol จาก 'scheduled' เป็น 'on_going' และบันทึกเวลาเริ่มต้น
    await prisma.patrol.update({
      where: {
        id: patrolId,
      },
      data: {
        status: "on_going",
        startTime: new Date(),
      },
    });
    // สร้างการแจ้งเตือนให้กับผู้ตรวจสอบที่ได้รับมอบหมาย
    const notifiedInspectors = new Set<number>();
    // ทำการสร้าง patrolResult สำหรับทุกๆ items ใน checklists
    for (const checklistObj of checklists) {
      const inspectorId = checklistObj.inspector.id;
      // วนลูปแต่ละ item และแต่ละ zone ของ checklist
      for (const items of checklistObj.checklist.items) {
        for (const zones of items.itemZones) {
          await prisma.patrolResult.create({
            data: {
              status: null,
              itemId: items.id,
              zoneId: zones.zone.id,
              patrolId: patrolId,
            },
          });
          // ส่งการแจ้งเตือนให้กับผู้ตรวจสอบถ้ายังไม่ได้แจ้งเตือน
          if (!notifiedInspectors.has(inspectorId)) {
            const message = `start_patrol`;
            await createNotification({
              message: message,
              type: "information" as NotificationType,
              url: `/patrol/${patrolId}/detail`,
              userId: inspectorId,
            });

            notifiedInspectors.add(inspectorId);
          }
        }
      }
    }
    // ดึงข้อมูล Patrol ที่อัปเดตจากฐานข้อมูลเพื่อส่งกลับ
    const updatePatrol = await prisma.patrol.findFirst({
      where: {
        id: patrolId,
      },
      include: {
        preset: {
          select: {
            id: true,
            title: true,
            description: true,
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
        results: {
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
        },
      },
    });

    let result = updatePatrol;
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({message: `Internal server error: ${error}`});
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
    // เช็คว่า userId เป็นผู้ตรวจสอบใน checklists หรือไม่
    const isUserInspector = checklists.some((checklistObj: any) => {
      return checklistObj.inspector.id === userId;
    });
    // หากไม่ใช่ผู้ตรวจสอบที่ได้รับมอบหมาย ให้ส่งกลับ error 403
    if (!isUserInspector) {
      res.status(403).json({
        message:
          "You are not authorized to finish this patrol. Only assigned inspectors can start the patrol.",
      });
      return;
    }
    // ตรวจสอบข้อมูลใน request body
    if (!checklists || !results) {
      res.status(400).json({ message: "Invalid Data" });
      return;
    }
    // ตรวจสอบว่า status เป็น "on_going" หรือไม่
    if (status !== "on_going") {
      res.status(400).json({ message: "Cannot finish patrol." });
      return;
    }
    const duration = calculateDuration(startTime);    // คำนวณระยะเวลาที่ใช้ในการทำ Patrol
    // อัปเดตสถานะของ Patrol จาก 'on_going' เป็น 'completed' และบันทึกเวลาเสร็จสิ้น
    await prisma.patrol.update({
      where: {
        id: patrolId,
      },
      data: {
        status: "completed",
        endTime: new Date(),
        duration: duration,
      },
    });
    // ดึงข้อมูล Patrol ที่อัปเดตจากฐานข้อมูล
    const updatePatrol = await prisma.patrol.findFirst({
      where: {
        id: patrolId,
      },
      include: {
        preset: {
          select: {
            id: true,
            title: true,
            description: true,
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
        results: {
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
        },
      },
    });
    // อัปเดตสถานะของผลการตรวจสอบ (patrolResult)
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
    // สร้างการแจ้งเตือนให้กับผู้ตรวจสอบที่เกี่ยวข้อง
    const notifiedInspectors = new Set<number>();
    for (const checklistObj of checklists) {
      const inspectorId = checklistObj.inspector.id;

      if (!notifiedInspectors.has(inspectorId)) {
        const message = `finish_patrol`;
        await createNotification({
          message: message,
          type: "information" as NotificationType,
          url: `/patrol/${patrolId}/detail`,
          userId: inspectorId,
        });
        notifiedInspectors.add(inspectorId);
      }
    }

    let result = updatePatrol;
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({message: `Internal server error: ${error}`});
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
    console.error(error)
    res.status(500).json({message: `Internal server error: ${error}`});
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
                              image: true,
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
                      createdAt: true,
                    },
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
    } else {
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
                      title: true,
                    },
                  },
                },
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
                              image: true,
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
                      createdAt: true,
                    },
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
    console.error(error)
    res.status(500).json({message: `Internal server error: ${error}`});
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

    // const notification = `new_comment`;
    // await createNotification({
    //   message: notification,
    //   type: "request" as NotificationType,
    //   url: `/comment/${newComment.id}`,
    //   userId: supervisorId,
    // });

    // ส่งข้อมูลคอมเมนต์พร้อมวันที่และเวลาที่บันทึกกลับไป
    let result = newComment;
    res.status(201).json(result);
    return;
  } catch (error) {
    res.status(500).json({message: `Internal server error: ${error}`});
    console.error(error);
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับตรวจสอบและอัปเดตสถานะ Patrol ที่เป็น "pending" ให้เป็น "scheduled"
 * Input: -
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
    today.setHours(0, 0, 0, 0);    // ตั้งเวลาเป็นเวลา 00:00:00.000 ของวันนี้
    // วนลูปผ่านแต่ละ Patrol
    for (const patrol of patrols) {
      const patrolDate = new Date(patrol.date);
      patrolDate.setHours(0, 0, 0, 0);      // ตั้งเวลาเป็น 00:00:00.000 ของวันที่ Patrol
      // ถ้าหากวันที่ Patrol ตรงกับวันที่ปัจจุบัน
      if (patrolDate.getTime() === today.getTime()) {
        try {
          await prisma.patrol.update({          // อัปเดตสถานะของ Patrol เป็น "scheduled"
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
 * Input: - 
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
