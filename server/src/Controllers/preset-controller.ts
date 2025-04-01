import prisma from "@Utils/database.js";
import { Request, Response } from "express";
import { Checklist } from "@prisma/client";

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสร้าง Preset ใหม่
 * Input:
 * - req.body: {
 *     title: String,
 *     description: String,
 *     checklists: Array<{ checklist: { id: number } }>,
 *   } (ข้อมูลของ Preset ที่ต้องการสร้าง)
 * Output: JSON object { message: String, preset: Object } ยืนยันการสร้าง Preset สำเร็จ
 **/
export async function createPreset(req: Request, res: Response) {
  try {
    const { title, description, checklists } = req.body;
    const userId = (req as any).user.userId;

    // ตรวจสอบว่า Prest ที่มีชื่อเดียวกันมีอยู่แล้วหรือไม่
    const existingPrest = await prisma.preset.findFirst({
      where: { title },
    });

    if (existingPrest) {
      res
        .status(400)
        .json({ message: `Preset with title "${title}" already exists` });
      return;
    }

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!title || !description || !userId) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    // สร้าง preset ใหม่ในฐานข้อมูล
    const newPreset = await prisma.preset.create({
      data: {
        title,
        description,
        version: 1,
        latest: true,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
    // เชื่อมโยง preset กับ checklists ที่เลือก
    for (const checklistId of checklists) {
      await prisma.presetChecklist.create({
        data: {
          presetId: newPreset.id,
          checklistId: parseInt(checklistId),
        },
      });
    }

    res
      .status(201)
      .json({ message: "Preset created successfully", preset: newPreset });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัปเดต Preset
 * Input:
 * - req.params.id: number (ID ของ Preset ที่ต้องการอัปเดต)
 * - req as any: userId: number
 * - req.body: {
 *     title: String,
 *     description: String,
 *     checklists: Array<{ checklist: { id: number } }>
 *   } (ข้อมูลของ Preset ที่ต้องการอัปเดต)
 * Output: JSON object { message: String, preset: Object } ยืนยันการอัปเดต Preset สำเร็จ
 **/
export async function updatePreset(req: Request, res: Response) {
  try {
    const { title, description, checklists } = req.body;
    const userId = (req as any).user.userId;
    const presetId = parseInt(req.params.id, 10);

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!title || !description || !Array.isArray(checklists)) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    // ค้นหาพ preset ที่ต้องการอัปเดต
    const currentPreset = await prisma.preset.findUnique({
      where: { id: presetId },
    });
    // ถ้าไม่พบ preset จะตอบกลับว่าไม่พบ preset
    if (!currentPreset) {
      res.status(404).json({ message: "Preset not found" });
      return;
    }
    // อัปเดตสถานะ preset เก่าให้เป็นไม่ใช่เวอร์ชันล่าสุด
    await prisma.preset.update({
      where: { id: presetId },
      data: { latest: false },
    });
    // สร้าง preset ใหม่ที่เป็นเวอร์ชันล่าสุด
    const newPreset = await prisma.preset.create({
      data: {
        title: title,
        description: description,
        version: currentPreset.version + 1, // เพิ่มเวอร์ชันใหม่
        latest: true,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
    // เชื่อมโยง preset ใหม่กับ checklists ที่เลือก
    for (const checklistId of checklists) {
      await prisma.presetChecklist.create({
        data: {
          presetId: newPreset.id,
          checklistId: parseInt(checklistId),
        },
      });
    }

    res
      .status(200)
      .json({ message: "Preset updated successfully", preset: newPreset });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัปเดต Checklist
 * Input:
 * - req.params.id: checklistId: number (ID ของ Checklist ที่ต้องการอัปเดต)
 * - req as any: userId: number
 * - req.body:{ title: string, items: Array }
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
    // ดึง checklist ปัจจุบันตาม id

    const currentChecklist = await prisma.checklist.findUnique({
      where: { id: checklistId },
    });

    if (!currentChecklist) {
      res.status(404).json({ message: "Checklist not found" });
      return;
    }
    // ตรวจสอบว่า checklist เป็นตัวล่าสุดหรือไม่

    if (currentChecklist.latest === true) {
      const now = new Date();
      const localTime = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      ).toISOString();

      if (title === currentChecklist.title) {
        // หาก title ตรงกัน ให้ทำการอัปเดต checklist เดิม

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

        res.status(201).json({
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
      res.status(404).json({ status:404, message: "No presets found" });
      return;
    }
    let result = preset;
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Preset ทั้งหมด
 * Input:
 * - req.query: boolean (optional, ระบุเพื่อดึงเฉพาะ Preset ที่เป็นเวอร์ชันล่าสุด)
 * Output: JSON array ข้อมูลของ Preset ทั้งหมดรวมถึงรายการ Checklist และรายการ Zone
 **/
export async function getAllPresets(req: Request, res: Response) {
  try {
    const { zones, startDate, endDate, search, latest } = req.query;
    const userRole = (req as any).user.role;

    const whereClause: any = {
      latest: latest === "false" ? undefined : true,
    };

    if (zones) {
      whereClause.presetChecklists = {
        some: {
          checklist: {
            items: {
              some: {
                itemZones: {
                  some: {
                    zone: {
                      name: {
                        in: (zones as string).split(","),
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
    }

    if (startDate || endDate) {
      whereClause.updatedAt = {};
      if (startDate) {
        whereClause.updatedAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        whereClause.updatedAt.lte = new Date(endDate as string);
      }
    }

    if (search) {
      // Use decodedSearch instead of raw search
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const presets = await prisma.preset.findMany({
      where: whereClause,
      include: {
        presetChecklists: {
          include: {
            checklist: {
              include: {
                items: {
                  include: {
                    itemZones: {
                      include: {
                        zone: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            profile: {
              select: {
                tel: true,
                name: true,
                image: {
                  select: { path: true },
                },
              },
            },
          },
        },
      },
    });

    if (!presets.length) {
      res.status(404).json({ message: "No presets found" });
      return;
    }

    const allPresets = await prisma.preset.findMany({
      select: { title: true },
    });

    const versionCounts = allPresets.reduce((acc, preset) => {
      acc[preset.title] = (acc[preset.title] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const result = presets.map((preset) => {
      let uniqueZones;

      if (userRole === "admin") {
        const zones = preset.presetChecklists.flatMap((checklist) =>
          checklist.checklist.items.flatMap((item) =>
            item.itemZones.map((itemZone) => ({
              name: itemZone.zone.name,
              userId: itemZone.zone.userId || null,
            }))
          )
        );
        uniqueZones = Array.from(
          new Map(zones.map((zone) => [zone.name, zone])).values()
        );
      } else {
        const zones = preset.presetChecklists.flatMap((checklist) =>
          checklist.checklist.items.flatMap((item) =>
            item.itemZones.map((itemZone) => itemZone.zone.name)
          )
        );
        uniqueZones = Array.from(new Set(zones));
      }

      const disabled = preset.presetChecklists.some((checklist) =>
        checklist.checklist.items.some((item) =>
          item.itemZones.some((itemZone) => itemZone.zone.userId === null)
        )
      );

      return {
        id: preset.id,
        title: preset.title,
        description: preset.description,
        version: preset.version,
        updatedAt: preset.updatedAt,
        user: preset.user,

        updateByUserName:
          preset.user?.profile?.name || preset.user?.username || "Unknown",
        updateByUserImagePath: preset.user?.profile?.image?.path,

        zones: uniqueZones,
        presetChecklists: preset.presetChecklists,
        versionCount: versionCounts[preset.title] || 0,
        disabled,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
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

    // เปลี่ยนสถานะเป็น unLatest
    await prisma.preset.update({
      where: { id: presetId },
      data: {
        latest: false,
      },
    });

    res.status(200).json({ message: "Preset removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Checklist ตาม ID
 * Input:
 * - req.params.id: number (ID ของ Checklist ที่ต้องการดึงข้อมูล)
 * - req.query: includeSupervisor:boolean (optional, ระบุเพื่อดึงข้อมูล Supervisor ที่เกี่ยวข้อง)
 * Output: JSON object ข้อมูลของ Checklist รวมถึงรายการ Item และ Zone
 **/
export async function getChecklist(req: Request, res: Response) {
  try {
    const checklistId = parseInt(req.params.id, 10);

    // Check if the optional "supervisor" query parameter is included
    const includeSupervisor = req.query.supervisor === "true";

    // Fetch the checklist and its items from the database
    const checklist = await prisma.checklist.findUnique({
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
                  select: {
                    id: true,
                    name: true,
                    supervisor: includeSupervisor
                      ? {
                          select: {
                            id: true,
                            role: true,
                            username: true,
                            email: true,
                            profile: {
                              select: {
                                image: true,
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

    // Check if the checklist exists
    if (!checklist) {
      res.status(404).json({ status: 404, message: "Checklist not found" });
      return;
    }

    // Format the response to include the zone names for each item
    const formattedChecklist = {
      ...checklist,
      items: checklist.items.map((item) => ({
        ...item,
      })),
    };

    res.status(200).json(formattedChecklist);
  } catch (error) {
    console.error("Error fetching checklist:", error);
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Checklist ทั้งหมด
 * Input:
 * - req.query: {zones, startDate, endDate, search, latest}
 * Output: JSON array ข้อมูลของ Checklist รวมถึงการนับจำนวน Item แต่ละประเภท
 **/
export async function getAllChecklists(req: Request, res: Response) {
  try {
    const { zones, startDate, endDate, search, latest } = req.query;
    // ตัวกรองเริ่มต้นเพื่อหา zones
    const whereClause: any = {
      latest: latest === "false" ? undefined : true,
    };

    // กรองโดย zones ถ้ามี
    if (zones) {
      whereClause.items = {
        some: {
          itemZones: {
            some: {
              zone: {
                name: {
                  in: (zones as string).split(","),
                },
              },
            },
          },
        },
      };
    }

    // กรองโดย ระยะวัน ถ้ามี
    if (startDate || endDate) {
      whereClause.updatedAt = {};
      if (startDate) {
        whereClause.updatedAt.gte = new Date(startDate as string); // greater than or equal to startDate
      }
      if (endDate) {
        whereClause.updatedAt.lte = new Date(endDate as string); // less than or equal to endDate
      }
    }

    // ค้นหาตาม Title ถ้ามี
    if (search) {
      whereClause.title = {
        contains: search as string,
      };
    }

    // Fetch ข้อมูลตาม ตัวกรอง
    const checklists = await prisma.checklist.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            profile: {
              select: {
                name: true,
                tel: true,
                image: true,
              },
            },
          },
        },
        items: {
          select: {
            id: true,
            name: true,
            type: true,
            checklistId: true,
            itemZones: {
              select: {
                zone: {
                  select: {
                    name: true,
                    supervisor: {
                      select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                        profile: {
                          select: {
                            name: true,
                            tel: true,
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
      },
    });

    if (!checklists.length) {
      res.status(404).json({ message: "No checklists found" });
      return;
    }

    // Fetch versions ของ Checklist ทั้งหมด เพื่อหา versionCounts
    const allChecklists = await prisma.checklist.findMany({
      select: {
        title: true,
      },
    });

    // คำนวณ version counts สำหรับ title ซ้ำ
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
          username: true,
          profile: true,
        },
      });

      const findImage = findUser?.profile?.imageId
        ? await prisma.image.findUnique({
            where: {
              id: findUser.profile.imageId,
            },
          })
        : null;

      return {
        username:
          findUser?.profile?.name || findUser?.username || "Unknown User",
        profileImage: findImage?.path,
      };
    };

    // แปลรูปแบบข้อมูล สำหรับ Response
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

        const items = checklist.items.filter(
          (name, index, self) => self.indexOf(name) === index
        );

        return {
          id: checklist.id,
          title: checklist.title,
          version: checklist.version,
          latest: checklist.latest,
          updatedAt: checklist.updatedAt,
          updateBy: checklist.updatedBy,
          updateByUserName: userdata.username,
          imagePath: userdata.profileImage || "",
          itemCounts,
          user: checklist.user,
          zones: zoneNames,
          versionCount: versionCounts[checklist.title] || 0,
          items: items,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสร้าง Checklist ใหม่
 * Input:
 * - req as any:userId:number
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
    if (!title) {
      res.status(400).json({ message: "Missing required field title" });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Items must not be empty" });
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

    res.status(201).json({
      message: "Checklist created successfully",
      checklist: newChecklist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
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
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}
