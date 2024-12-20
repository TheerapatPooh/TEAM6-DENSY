import prisma from "@Utils/database.js";
import { Request, Response } from "express";
import { checklists } from "../Utils/data/checklists";
import { title } from "process";
import { item_zones } from "../Utils/data/item-zones";
import { zones } from "../Utils/data/zones";
import { items } from "../Utils/data/items";
import { Checklist } from "@prisma/client";
import path from "path";

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสร้าง Preset ใหม่
 * Input:
 * - req.body: {
 *     title: String,
 *     description: String,
 *     checklists: Array<{ checklist: { id: number } }>,
 *     userId: number
 *   } (ข้อมูลของ Preset ที่ต้องการสร้าง)
 * Output: JSON object { message: String, preset: Object } ยืนยันการสร้าง Preset สำเร็จ
 **/
export async function createPreset(req: Request, res: Response) {
  try {
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
 * Output: JSON object { message: String, preset: Object } ยืนยันการอัปเดต Preset สำเร็จ
 **/
export async function updatePreset(req: Request, res: Response) {
  try {
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
 * คำอธิบาย: ฟังก์ชันสำหรับอัปเดต Checklist
 * Input:
 * - req.params.id: number (ID ของ Checklist ที่ต้องการอัปเดต)
 * - userId: number
 * - checklistId: number (ID ของ Checklist ที่ต้องการอัปเดต)
 * - title: string (ชื่อของ Checklist)
 * - items: Array (รายการไอเทมใน Checklist)</
 * Output: JSON object { message: String, checklist: Object } ยืนยันการอัปเดต Checklistสำเร็จ
 **/
export async function updateChecklist(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const checklistId = parseInt(req.params.id, 10);
    const { title, items } = req.body;

    // ตรวจสอบข้อมูล
    if (!title || !items) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const currentChecklist = await prisma.checklist.findUnique({
      where: { id: checklistId },
    });

    if (!currentChecklist) {
      res.status(404).json({ message: "Checklist not found" });
      return;
    }

    if (currentChecklist.latest === true) {
      const now = new Date();
      const localTime = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      ).toISOString();

      if (title === currentChecklist.title) {
        await prisma.checklist.update({
          where: { id: checklistId },
          data: { latest: false, updatedAt: localTime, updatedBy: userId },
        });

        // สร้าง Checklist ใหม่
        const newChecklist = await prisma.checklist.create({
          data: {
            title: title,
            version: currentChecklist.version + 1,
            latest: true,
            updatedAt: localTime, // อัปเดตใหม่ที่ใช้ในการตรวจสอบใหม่
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

        res
          .status(201)
          .json({
            message: "Checklist update successfully",
            checklists: newChecklist,
          });
      } else {
        res
          .status(500)
          .json({ message: "Title does not match the existing checklist" }); //ชื่อมีการเปลี่ยนแปลง
      }
    } else {
      res
        .status(500)
        .json({ message: "Update restricted to the latest checklist only" }); //ไม่ใช่ล่าสุด
    }
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
    res.status(500);
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Preset ทั้งหมด
 * Input:
 * - req.query.latest: "true" | "false" (optional, ระบุเพื่อดึงเฉพาะ Preset ที่เป็นเวอร์ชันล่าสุด)
 * Output: JSON array ข้อมูลของ Preset ทั้งหมดรวมถึงรายการ Checklist และรายการ Zone
 **/
export async function getAllPresets(req: Request, res: Response) {
  try {
    let latest = true;
    if (req.query.latest && req.query.latest === "true") {
      latest = false;
    }
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

    const result = presets.map((preset) => {
      const zones = preset.presetChecklists.flatMap((checklist) =>
        checklist.checklist.items.flatMap((item) =>
          item.itemZones.map((itemZone) => ({
            id: itemZone.zone.id,
            name: itemZone.zone.name,
          }))
        )
      );

      // ใช้ Set เพื่อกรองค่าที่ซ้ำกัน
      const uniqueZones = Array.from(
        new Map(zones.map((zone) => [`${zone.id}-${zone.name}`, zone])).values()
      );

      return {
        id: preset.id,
        title: preset.title,
        description: preset.description,
        presetChecklists: preset.presetChecklists,
        zones: uniqueZones,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500);
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับลบ Preset
 * Input:
 * - req.params.id: number (ID ของ Preset ที่ต้องการลบ)
 * Output: JSON object {  "message": "Preset removed successfully" } ยืนยันการลบ Preset สำเร็จ
 **/
export async function removePreset(req: Request, res: Response) {
  try {
    const presetId = parseInt(req.params.id, 10);
    if (isNaN(presetId)) {
      res.status(400).json({ message: "Invalid Preset ID" });
      return;
    }

    // ตรวจสอบว่า Preset มีการใช้งานใน Patrol หรือไม่
    const patrolCount = await prisma.patrol.count({
      where: { presetId: presetId },
    });

    if (patrolCount > 0) {
      res.status(400).json({
        message:
          "Cannot delete Preset: Patrols are still linked to this Preset",
      });
      return;
    }

    // ลบข้อมูล PresetChecklist ที่เกี่ยวข้อง
    await prisma.presetChecklist.deleteMany({
      where: { presetId: presetId },
    });

    // ลบข้อมูล Preset
    await prisma.preset.delete({
      where: { id: presetId },
    });

    res.status(200).json({ message: "Preset removed successfully" });
  } catch (error) {
    res.status(500);
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
    res.status(500);
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
    // Fetch all checklists where latest = true
    const checklists = await prisma.checklist.findMany({
      where: {
        latest: true,
      },
      include: {
        items: {
          select: {
            itemZones: {
              select: {
                zone: {
                  select: {
                    name: true, // Fetch zone names
                  },
                },
              },
            },
            type: true, // Fetch item types
          },
        },
      },
    });

    if (!checklists.length) {
      res.status(404).json({ message: "No checklists found" });
      return;
    }

    // Fetch all versions to calculate version counts
    const allChecklists = await prisma.checklist.findMany({
      select: {
        title: true,
      },
    });

    // Calculate version counts for each title
    const versionCounts = allChecklists.reduce((acc, checklist) => {
      acc[checklist.title] = (acc[checklist.title] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const findUser = async (checklist: Checklist) => {
      const findUser = await prisma.user.findUnique({
        where: {
          id: checklist.updatedBy,
        },
        select: {
          username: true, // Include the username directly
          profile: true
        },
      });

      const findImage = findUser?.profile?.imageId
      ? await prisma.image.findUnique({
          where: {
            id: findUser.profile.imageId,
          },
        })
      : null;
    

      const results = {
        username:findUser?.profile?.name || findUser?.username ||"Unknown User",
        profileImage:findImage?.path
      }

      // Safely determine the name or fallback to username
      return (results );
    };

    // Transform the result
    const result = await Promise.all(
      checklists.map(async (checklist) => {
        const itemCounts = checklist.items.reduce(
          (acc: Record<string, number>, item) => {
            acc[item.type] = (acc[item.type] || 0) + 1;
            return acc;
          },
          {}
        );

        const zoneNames = checklist.items
          .flatMap((item) =>
            item.itemZones.map((itemZone) => itemZone.zone.name)
          )
          .filter((name, index, self) => self.indexOf(name) === index); // Remove duplicates

        const userdata = await findUser(checklist);

        return {
          id: checklist.id,
          title: checklist.title,
          version: checklist.version,
          latest: checklist.latest,
          updatedAt: checklist.updatedAt,
          updateBy: checklist.updatedBy,
          updateByUserName:userdata.username,
          imagePath:userdata.profileImage || "",
          itemCounts,
          zones: zoneNames,
          versionCount: versionCounts[checklist.title] || 0, // Attach the version count
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
    const userId = (req as any).user.userId;

    // รับค่าจาก body
    const { title, items } = req.body;

    // ตรวจสอบข้อมูล
    if (!title || !items) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // ตรวจสอบว่า Checklist ที่มีชื่อเดียวกันมีอยู่แล้วหรือไม่
    const existingChecklist = await prisma.checklist.findFirst({
      where: { title },
    });

    if (existingChecklist) {
      res
        .status(400)
        .json({ message: `Checklist with title "${title}" already exists` });
      return;
    }

    const now = new Date();
    const localTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString();

    // สร้าง Checklist ใหม่
    const newChecklist = await prisma.checklist.create({
      data: {
        title: title,
        version: 1,
        latest: true,
        updatedAt: localTime,
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

    res
      .status(201)
      .json({
        message: "Checklist created successfully",
        checklist: newChecklist,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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

    res
      .status(200)
      .json({ message: "Checklist has been deactivated successfully" });
    return;
  } catch (error) {
    res.status(500);
    return;
  }
}
