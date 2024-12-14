import prisma from "@Utils/database.js";
import { Request, Response } from "express";

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสร้าง Preset ใหม่
 * Input:
 * - req.body: {
 *     title: String,
 *     description: String,
 *     checklists: Array<{ checklist: { id: number } }>,
 *     userId: number
 *   } (ข้อมูลของ Preset ที่ต้องการสร้าง)
 * - req.user: { role: String } (บทบาทของผู้ใช้งาน เช่น "admin")
 * Output: JSON object { message: String, preset: Object } ยืนยันการสร้าง Preset สำเร็จ
**/
export async function createPreset(req: Request, res: Response) {
  try {
    const userRole = (req as any).user.role;
    if (userRole !== "admin") {
      res.status(403).json({ message: "Access Denied: Admins only" });
      return;
    }

    const { title, description, checklists, userId } = req.body;

    if (!title || !description || !checklists || !userId) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const newPreset = await prisma.preset.create({
      data: {
        title: title,
        description: description,
        version: 1,
        latest: true,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
    for (const checklist of checklists) {
      const { id } = checklist.checklist;
      await prisma.presetChecklist.create({
        data: {
          presetId: newPreset.id,
          checklistId: id,
        },
      });
    }
    res
      .status(201)
      .json({ message: "Preset created successfully", preset: newPreset });
  } catch (error) {
    console.error(error);
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัปเดต Preset
 * Input:
 * - req.params.id: number (ID ของ Preset ที่ต้องการอัปเดต)
 * - req.body: {
 *     title: String,
 *     description: String,
 *     checklists: Array<{ checklist: { id: number } }>,
 *     userId: number
 *   } (ข้อมูลของ Preset ที่ต้องการอัปเดต)
 * - req.user: { role: String } (บทบาทของผู้ใช้งาน เช่น "admin")
 * Output: JSON object { message: String, preset: Object } ยืนยันการอัปเดต Preset สำเร็จ
**/
export async function updatePreset(req: Request, res: Response) {
  try {
    const userRole = (req as any).user.role;
    if (userRole !== "admin") {
      res.status(403).json({ message: "Access Denied: Admins only" });
      return;
    }

    const { title, description, checklists, userId } = req.body;
    const presetId = parseInt(req.params.id, 10);

    if (!presetId || !title || !description || !checklists || !userId) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const currentPreset = await prisma.preset.findUnique({
      where: { id: presetId },
    });

    if (!currentPreset) {
      res.status(404).json({ message: "Preset not found" });
      return;
    }

    await prisma.preset.update({
      where: { id: presetId },
      data: { latest: false },
    });

    const newPreset = await prisma.preset.create({
      data: {
        title: title,
        description: description,
        version: currentPreset.version + 1,
        latest: true,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });

    for (const checklist of checklists) {
      const { id } = checklist.checklist;
      await prisma.presetChecklist.create({
        data: {
          presetId: newPreset.id,
          checklistId: id,
        },
      });
    }

    res
      .status(200)
      .json({ message: "Preset updated successfully", preset: newPreset });
  } catch (error) {
    console.error(error);
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Preset ตาม ID
 * Input:
 * - req.params.id: number (ID ของ Preset ที่ต้องการดึงข้อมูล)
 * Output: JSON object ข้อมูลของ Preset รวมถึงรายการ Checklist
**/
export async function getPreset(req: Request, res: Response) {
  try {
    const presetId = parseInt(req.params.id, 10);
    const preset = await prisma.preset.findUnique({
      where: { id: presetId },
      select: {
        id: true,
        title: true,
        description: true,
        presetChecklists: {
          select: {
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
          },
        },
      },
    });

    if (!preset) {
      res.status(404);
      return;
    }
    let result = preset;
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Preset ทั้งหมด
 * Input:
 * - req.query.latest: "true" | "false" (optional, ระบุเพื่อดึงเฉพาะ Preset ที่เป็นเวอร์ชันล่าสุด)
 * Output: JSON array ข้อมูลของ Preset ทั้งหมด รวมถึงรายการ Checklist
**/
export async function getAllPresets(req: Request, res: Response) {
  try {
    const latest = req.query.latest === "true";
    const presets = await prisma.preset.findMany({
      where: latest ? { latest: latest } : undefined,
      select: {
        id: true,
        title: true,
        description: true,
        presetChecklists: {
          select: {
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
          },
        },
      },
    });

    if (!presets.length) {
      res.status(404);
      return;
    }

    let result = presets;
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Checklist ตาม ID
 * Input:
 * - req.params.id: number (ID ของ Checklist ที่ต้องการดึงข้อมูล)
 * - req.query.supervisor: "true" | "false" (optional, ระบุเพื่อดึงข้อมูล Supervisor ที่เกี่ยวข้อง)
 * Output: JSON object ข้อมูลของ Checklist รวมถึงรายการ Item และ Zone
**/
export async function getChecklist(req: Request, res: Response) {
  try {
    const checklistId = parseInt(req.params.id, 10);

    // รับค่าพารามิเตอร์ (optional)
    const includeSupervisor = req.query.supervisor === "true";

    // ดึงข้อมูล Checklists จากฐานข้อมูล
    const checklists = await prisma.checklist.findUnique({
      where: { id: checklistId },
      include: {
        items: {
          select: {
            id: true,
            name: true,
            type: true,
            checklistId: true,
            itemZones: {
              select: {
                zone: {
                  include: {
                    supervisor: includeSupervisor
                      ? {
                          select: {
                            id: true,
                            role: true,
                            profile: {
                              select: {
                                id: true,
                                name: true,
                                age: true,
                                tel: true,
                                address: true,
                              },
                            },
                          },
                        }
                      : undefined,
                  },
                },
              },
            },
          },
        },
      },
    });

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (!checklists) {
      res.status(404).json({ message: "Checklist not found" });
      return;
    }
    let result = checklists;
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Checklist ทั้งหมด
 * Input:
 * - ไม่มี Input
 * Output: JSON array ข้อมูลของ Checklist รวมถึงการนับจำนวน Item แต่ละประเภท
**/
export async function getAllChecklists(req: Request, res: Response) {
  try {
    // ดึงข้อมูล Checklist ทั้งหมด
    const checklists = await prisma.checklist.findMany({
      include: {
        items: {
          select: {
            type: true,
          },
        },
      },
    });

    if (!checklists.length) {
      res.status(404);
      return;
    }

    // แปลงข้อมูลเพื่อนับจำนวน item แต่ละประเภทในแต่ละ checklist
    const result = checklists.map((checklist) => {
      const itemCounts = checklist.items.reduce(
        (acc: Record<string, number>, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        },
        {}
      );

      return {
        id: checklist.id,
        title: checklist.title,
        version: checklist.version,
        latest: checklist.latest,
        updatedAt: checklist.updatedAt,
        updateBy: checklist.updatedBy,
        itemCounts, // นับจำนวน item แต่ละประเภท
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสร้าง Checklist ใหม่ 
 * Input:
 * - req.body:
 *   - title: string (ชื่อของ Checklist)
 *   - items: Array (รายการของไอเทมใน Checklist)
 *     - name: string (ชื่อของไอเทม)
 *     - type: string (ประเภทของไอเทม เช่น safety, maintenance)
 *     - zoneId: Array<number> (Array ของ Zone ID ที่เชื่อมโยงกับไอเทมนั้น)
 * Output:
 * - JSON message ยืนยันการสร้าง Checklist สำเร็จ
 **/
export async function createChecklist(req: Request, res: Response) {
  try {
    const userRole = (req as any).user.role;
    const userId = (req as any).user.userId;

    // ตรวจสอบสิทธิ์ว่าเป็น admin
    if (userRole !== "admin") {
      res.status(403).json({ message: "Access Denied: Admins only" });
      return;
    }

    // รับค่าจาก body
    const { title, items } = req.body;

    // ตรวจสอบข้อมูล
    if (!title || !items) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // สร้าง Checklist ใหม่
    const newChecklist = await prisma.checklist.create({
      data: {
        title: title,
        version: 1,
        latest: true,
        updatedBy: userId, // ID ของผู้ใช้งานที่สร้าง
      },
    });

    // สร้างไอเทมและเชื่อมโยงโซน
    for (const item of items) {
      const { name, type, zoneId } = item;

      // สร้างไอเทมใหม่
      const newItem = await prisma.item.create({
        data: {
          name: name,
          type: type,
          checklistId: newChecklist.id,
        },
      });

      // เชื่อมโยงไอเทมกับโซนโดยใช้ Zone ID
      for (const id of zoneId) {
        const zone = await prisma.zone.findUnique({
          where: { id: id },
        });

        if (!zone) {
          res.status(404).json({ message: `Zone ID "${id}" not found` });
          return;
        }

        // สร้าง itemZone
        await prisma.itemZone.create({
          data: {
            itemId: newItem.id,
            zoneId: zone.id,
          },
        });
      }
    }

    res.status(201).json({ message: "Checklist created successfully",checklists: newChecklist });
  } catch (error) {
    console.error(error)
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับลบ checklist (เปลี่ยนสถานะเป็น false)
 * Input: req.params.id: Int (ID ของ User ที่จะลบ)
 * Output: JSON message ยืนยันการลบ User สำเร็จ
**/
export async function removeChecklist(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const role = (req as any).user.role;

    if (role !== "admin") {
      res.status(403).json({ message: "Access Denied: Admin only" });
      return;
    }

    const checklist = await prisma.checklist.findUnique({
      where: { id: id },
    });

    if (!checklist) {
      res.status(404).json({ message: "Checklist not found" });
      return;
    }

    await prisma.checklist.update({
      where: { id: id },
      data: {
        latest: false,
      },
    });

    res.status(200).json({ message: "Checklist has been deactivated successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to deactivated checklist" });
    return;
  }
}
