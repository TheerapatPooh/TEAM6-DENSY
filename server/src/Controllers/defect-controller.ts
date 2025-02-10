import prisma from "@Utils/database.js";
import { Request, Response } from "express";
import { createNotification } from "@Controllers/util-controller.js";
import { DefectStatus, ItemType, NotificationType } from "@prisma/client";
import fs from "fs";
import path from "path";

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสร้าง Defect ใหม่
 * Input:
 * - req as any user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * - req.body: { name: String, description: String, type: ItemType, defectUserId: Int, patrolResultId: Int, supervisorId: Int }
 * - req.files: Array<Express.Multer.File> (ไฟล์รูปภาพใหม่)
 * Output: JSON object ข้อมูล Defect ที่ถูกสร้าง พร้อมกับอัปเดตสถานะของ patrolResult
 **/
export async function createDefect(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const {
      name,
      description,
      type,
      defectUserId,
      patrolResultId,
      supervisorId,
    } = req.body;
    const imageFiles = req.files as Express.Multer.File[];

    const validPatrol = await prisma.patrol.findFirst({
      //เช็คว่า Patrol มีอยู่จริงหรือไม่
      where: {
        results: {
          some: {
            id: parseInt(patrolResultId),
          },
        },
        patrolChecklists: {
          some: {
            userId: parseInt(userId),
          },
        },
      },
    });

    if (!validPatrol) {
      // response 404 ถ้า Patrol ไม่มีอยู่จริง
      res.status(404).json({
        message:
          "You are not associated with this Patrol or PatrolResult not found",
      });
      return;
    }

    const newDefect = await prisma.defect.create({
      //สร้าง Defect
      data: {
        name: name,
        description: description,
        type: type,
        status: "reported" as DefectStatus,
        startTime: new Date(),
        user: { connect: { id: parseInt(defectUserId) } },
        supervisor: { connect: { id: parseInt(supervisorId) } },
        patrolResult: { connect: { id: parseInt(patrolResultId) } },
      },
    });

    const updateResult = async (patrolResultId: string) => {
      //อัพเดต ข้อมูลที่เกี่ยวข้อง
      try {
        const result = await prisma.patrolResult.findUnique({
          where: {
            id: parseInt(patrolResultId),
          },
        });

        if (!result) {
          console.error("Patrol result not found");
          return;
        }

        const updatedResult = await prisma.patrolResult.update({
          where: { id: parseInt(patrolResultId) },
          data: {
            status: false,
          },
        });

        return updatedResult;
      } catch (error) {
        console.error("Error updating patrol result:", error);
      }
    };
    updateResult(patrolResultId);
    if (Array.isArray(imageFiles)) {
      for (const imageFile of imageFiles) {
        const imagePath = imageFile.filename;
        const image = await prisma.image.create({
          data: {
            path: imagePath,
            updatedBy: parseInt(defectUserId),
          },
        });

        if (image) {
          await prisma.defectImage.create({
            data: {
              defectId: newDefect.id,
              imageId: image.id,
            },
          });
        }
      }
    } else {
      console.error("No files uploaded or incorrect file structure.");
    }
    const message = `report_defect`;
    const supervisor = parseInt(supervisorId, 10);

    await createNotification({
      //สร้าง Notifications แจ้งเตือนผู้ใช้ที่เดี่ยวข้อง
      message: message,
      type: "request" as NotificationType,
      url: `/defect/${newDefect.id}`,
      userId: supervisor,
    });

    let result = await prisma.defect.findFirst({
      // Response
      where: { id: newDefect.id },
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

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Defect
 * Input:
 * - req.params: { id: Int} (ID ของ Defect)
 * Output: JSON object ข้อมูล Defect และข้อมูล patrolResult ที่เกี่ยวข้อง
 **/
export async function getDefect(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const defect = await prisma.defect.findUnique({
      // หา Defect
      where: {
        id: Number(id),
      },
      include: {
        images: {
          include: {
            image: {
              include: {
                user: {
                  select: {
                    id: true,
                    role: true,
                    email: true,
                    createdAt: true,
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
        user: {
          select: {
            id: true,
            role: true,
            email: true,
            createdAt: true,
            profile: {
              include: {
                image: true,
              },
            },
          },
        },
        patrolResult: {
          select: {
            itemZone: {
              select: {
                zone: {
                  include: {
                    supervisor: {
                      select: {
                        profile: true,
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

    if (!defect) {
      res.status(404).json({ message: "Defect not found" });
      return;
    }

    let result = defect; // Response

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Defect ทั้งหมด
 * Input:
 * - req as any: user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * - req.query: { status: DefectStatus, type: ItemType, startDate: Date, endDate: Date, search:String }
 * Output: JSON array ข้อมูล Defect ทั้งหมด รวมถึงข้อมูล patrolResult และ user ที่เกี่ยวข้อง
 **/
export async function getAllDefects(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { status, type, startDate, endDate, search } = req.query;
    // สร้างเงื่อนไขหลัก
    const whereConditions: any = {
      supervisorId: userId
    };

    const andConditions: any[] = [];

    // เงื่อนไขการกรองตาม status
    if (status) {
      andConditions.push({ status: status });
    }

    // เงื่อนไขการกรองตาม preset
    if (type) {
      const typeArray = (type as string).split(","); // แยกค่าด้วย comma
      const orTypeConditions = typeArray.map((t) => ({ type: t })); // สร้าง array ของ OR เงื่อนไข

      andConditions.push({ OR: orTypeConditions });
    }

    // เงื่อนไขการกรองตามช่วงเวลา
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        andConditions.push({
          startTime: {
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

      function mapSearchToStatus(search: string): DefectStatus | null {
        const searchLower = search.toLowerCase();

        // ตรวจสอบความใกล้เคียงกับค่าของ DefectStatus
        if (searchLower.startsWith("rep")) {
          return DefectStatus.reported;
        } else if (searchLower.startsWith("in")) {
          return DefectStatus.in_progress;
        } else if (searchLower.startsWith("pe")) {
          return DefectStatus.pending_inspection;
        } else if (searchLower.startsWith("res")) {
          return DefectStatus.resolved;
        } else if (searchLower.startsWith("co")) {
          return DefectStatus.completed;
        }
        // ถ้าไม่มีค่าใดที่ตรงกับการค้นหา
        return null;
      }

      function mapSearchToType(search: string): ItemType | null {
        const searchLower = search.toLowerCase();

        // ตรวจสอบความใกล้เคียงกับค่าของ DefectStatus
        if (searchLower.startsWith("sa")) {
          return ItemType.safety;
        } else if (searchLower.startsWith("en")) {
          return ItemType.environment;
        } else if (searchLower.startsWith("ma")) {
          return ItemType.maintenance;
        }

        // ถ้าไม่มีค่าใดที่ตรงกับการค้นหา
        return null;
      }

      const mappedStatus = mapSearchToStatus(search as string);
      const mappedTypes = mapSearchToType(search as string);

      const orConditions = [];

      if (!isNaN(searchId)) {
        orConditions.push({ id: searchId });
      }

      // ถ้า mappedStatus มีค่า (ค้นหาตรงกับสถานะ)
      if (mappedStatus) {
        orConditions.push({ status: mappedStatus as DefectStatus });
      }

      // ถ้า mappedTypes มีค่า (ค้นหาตรงกับชนิด)
      if (mappedTypes) {
        orConditions.push({ type: mappedTypes as ItemType });
      }

      // ถ้ามีค่า preset title
      orConditions.push({
        name: {
          contains: search as string,
        },
      });

      orConditions.push({
        user: {
          profile: {
            name: {
              contains: search as string,
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

    const defects = await prisma.defect.findMany({
      where: whereConditions,
      include: {
        supervisor: {
          select: {
            id: true,
            profile: true
          }
        },
        patrolResult: {
          select: {
            zoneId: true,
            itemZone: {
              select: {
                zone: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            role: true,
            email: true,
            createdAt: true,
            profile: {
              select: {
                id: true,
                name: true,
                tel: true,
                image: true,
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
                    role: true,
                    email: true,
                    createdAt: true,
                    profile: {
                      select: {
                        id: true,
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
    });

    let result = defects;
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}

function getUploadsPath(): string {
  const currentDir = process.cwd();
  return path.join(currentDir, "uploads"); // Adjust path as needed
}

const uploadsPath = getUploadsPath();

/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัปเดต Defect
 * Input:
 * - req.params: { id: Int} (ID ของ Defect ที่จะอัปเดต)
 * - req.body: {name: String, description: String, type: ItemType, status: DefectStatus, defectUserId: Int, patrolResultId: Int , supervisorId: Int  , deleteExistingImages: boolean}
 * - req.file: Array<Express.Multer.File> (ไฟล์รูปภาพใหม่)
 * Output: JSON object ข้อมูล Defect หลังการอัปเดต
 **/
export async function updateDefect(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      type,
      status,
      defectUserId,
      supervisorId,
      patrolResultId,
      deleteExistingImages,
    } = req.body;
    const newImageFiles = req.files as Express.Multer.File[];

    const defect = await prisma.defect.findUnique({
      where: { id: Number(id) },
    });
    if (!defect) {
      //เช็ค defect
      res.status(404).json({ message: "Defect not found" });
      return;
    }

    if (newImageFiles?.length) {
      //หารูปที่อยู่ในระบบ ค้นหาภาพที่เกี่ยวข้องกับ Defect นี้
      const existingDefectImages = await prisma.defectImage.findMany({
        where: { defectId: Number(id) },
        select: { imageId: true },
      });

      const defectImagesBySupervisor = await prisma.image.findMany({
        // ค้นหาข้อมูลเกี่ยวกับภาพที่มีอยู่ในระบบ
        where: {
          id: { in: existingDefectImages.map((img) => img.imageId) },
        },
        select: { id: true, updatedBy: true },
      });

      if (status === ("reported" as DefectStatus)) {
        // หากสถานะเป็น "reported" ให้ลบภาพทั้งหมดที่เกี่ยวข้อง
        const imageIdsToDelete = existingDefectImages.map((img) => img.imageId);
        // ค้นหาภาพที่ต้องการลบ
        const imagesToDelete = await prisma.image.findMany({
          where: { id: { in: imageIdsToDelete } },
          select: { path: true },
        });
        // ลบไฟล์ภาพจากที่เก็บ
        for (const image of imagesToDelete) {
          const filePath = path.join(uploadsPath, image.path);
          try {
            fs.unlinkSync(filePath);
          } catch (error) {
            console.error(`Failed to delete file at ${filePath}:`, error);
          }
        }
        // ลบข้อมูลจากฐานข้อมูล
        await prisma.defectImage.deleteMany({
          where: { defectId: Number(id) },
        });
        await prisma.image.deleteMany({
          where: { id: { in: imageIdsToDelete } },
        });
      }

      if (
        status === ("resolved" as DefectStatus) &&
        deleteExistingImages === "true"
      ) {
        // หากสถานะเป็น "resolved" และต้องการลบภาพที่เกี่ยวข้องกับ supervisor
        const imageIdsToDelete = defectImagesBySupervisor
          .filter((image) => image.updatedBy === parseInt(supervisorId, 10))
          .map((image) => image.id);

        const imagesToDelete = await prisma.image.findMany({
          where: { id: { in: imageIdsToDelete } },
          select: { path: true },
        });

        for (const image of imagesToDelete) {
          const filePath = path.join(uploadsPath, image.path);
          try {
            fs.unlinkSync(filePath);
          } catch (error) {
            console.error(`Failed to delete file at ${filePath}:`, error);
          }
        }

        // ลบข้อมูลใน defectImage และ image สำหรับ imageIds ที่เลือกไว้
        await prisma.defectImage.deleteMany({
          where: {
            defectId: Number(id),
            imageId: { in: imageIdsToDelete },
          },
        });

        await prisma.image.deleteMany({
          where: { id: { in: imageIdsToDelete } },
        });
      }
      // บันทึกไฟล์ภาพใหม่ลงในฐานข้อมูล
      for (const file of newImageFiles) {
        const image = await prisma.image.create({
          data: {
            path: file.filename,
            updatedBy: parseInt(
              status === ("reported" as DefectStatus)
                ? defectUserId
                : supervisorId,
              10
            ),
          },
        });
        await prisma.defectImage.create({
          data: {
            defectId: Number(id),
            imageId: image.id,
          },
        });
      }
    }
    // สร้างข้อมูลสำหรับการอัปเดต Defect
    const updateData: any = {};
    // อัปเดตข้อมูลของ Defect หากมีการเปลี่ยนแปลง
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (status !== undefined) updateData.status = status;

    if (defectUserId !== undefined) {
      updateData.user = { connect: { id: parseInt(defectUserId, 10) } };
    }

    if (patrolResultId !== undefined) {
      updateData.patrolResult = {
        connect: { id: parseInt(patrolResultId, 10) },
      };
    }

    // ทำการอัปเดต Defect ด้วยข้อมูลที่มี
    await prisma.defect.update({
      where: { id: Number(id) },
      data: updateData,
    });

    let message = null;
    let notiType = null;
    let url = null;
    let receive = null;

    if (status === ("in_progress" as DefectStatus)) {
      (message = "defect_accept"),
        (notiType = "information" as NotificationType);
      url = `/patrol-defect`;
      receive = defectUserId;
    } else if (status === ("resolved" as DefectStatus)) {
      message = "defect_resolved";
      notiType = "information" as NotificationType;
      url = `/patrol-defect`;
      receive = defectUserId;
    } else if (status === ("pending_inspection" as DefectStatus)) {
      message = "defect_pending_inspection";
      notiType = "request" as NotificationType;
      url = `/defect/${id}`;
      receive = supervisorId;
    } else if (status === ("completed" as DefectStatus)) {
      message = "defect_completed";
      notiType = "information" as NotificationType;
      url = `/defect/${id}`;
      receive = supervisorId;
    }

    if (message) {
      await createNotification({
        message,
        type: notiType,
        url,
        userId: parseInt(receive),
      });
    }

    const result = await prisma.defect.findUnique({
      // Response
      where: { id: Number(id) },
      include: {
        supervisor: {
          select: {
            id: true,
            profile: true
          }
        },
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
              include: {
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
        user: {
          select: {
            id: true,
            role: true,
            email: true,
            createdAt: true,
            profile: {
              include: {
                image: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับลบ Defect
 * Input:
 * - (req as any).user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * - req.params: { id: Int} (ID ของ Defect ที่จะลบ)
 * Output: JSON message ยืนยันการลบ Defect สำเร็จ
 **/
export async function deleteDefect(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;

    const { id } = req.params;

    const defect = await prisma.defect.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!defect) {
      //เช็ค defect
      res.status(404).json({ message: "Defect not found" });
      return;
    }
    // ค้นหาภาพที่เกี่ยวข้องกับ Defect นี้
    const existingDefectImages = await prisma.defectImage.findMany({
      where: { defectId: Number(id) },
      select: { imageId: true },
    });
    // ดึง IDs ของภาพที่จะลบ
    const imageIdsToDelete = existingDefectImages.map((img) => img.imageId);
    // ค้นหาข้อมูลภาพที่จะลบ
    const imagesToDelete = await prisma.image.findMany({
      where: { id: { in: imageIdsToDelete } },
      select: { path: true },
    });
    // ลบไฟล์ภาพจากที่เก็บในระบบ
    for (const image of imagesToDelete) {
      const filePath = path.join(uploadsPath, image.path);
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error(`Failed to delete file at ${filePath}:`, error);
      }
    }
    // ลบข้อมูลในฐานข้อมูลที่เชื่อมโยงกับ Defect และภาพ
    await prisma.defectImage.deleteMany({
      where: { defectId: Number(id) },
    });
    await prisma.image.deleteMany({
      where: { id: { in: imageIdsToDelete } },
    });
    // ตรวจสอบว่าผู้ใช้งานมีสิทธิ์ใน Patrol ที่เกี่ยวข้องกับ Defect นี้หรือไม่
    const validPatrol = await prisma.patrol.findFirst({
      where: {
        results: {
          some: {
            id: defect.patrolResultId,
          },
        },
        patrolChecklists: {
          some: {
            userId: userId,
          },
        },
      },
    });
    // หากไม่พบ Patrol ที่เกี่ยวข้องกับผู้ใช้งานให้แสดงข้อผิดพลาด 404
    if (!validPatrol) {
      res
        .status(404)
        .json({ message: "You are not associated with this Patrol" });
      return;
    }
    // ลบข้อมูล Defect จากฐานข้อมูล
    await prisma.defect.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ message: "Defect deleted successfully" });
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Comment ทั้งหมด
 * Input:
 * - req as any:user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * - req.query:{ status:DefectStatus, startDate:Date, endDate:Date, search:String }
 * Output: JSON array ข้อมูล Comment ทั้งหมด รวมถึงข้อมูล patrolResult และ user ที่เกี่ยวข้อง
 **/
export async function getAllComments(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { status, startDate, endDate, search } = req.query;
    // สร้างเงื่อนไขหลัก
    const whereConditions: any = {
      supervisorId: userId
    };

    const andConditions: any[] = [];

    // เงื่อนไขการกรองตาม status
    if (status !== undefined) {
      const statusBoolean = status === "true";
      andConditions.push({ status: statusBoolean });
    }

    // เงื่อนไขการกรองตามช่วงเวลา
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        andConditions.push({
          startTime: {
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

      function mapSearchToStatus(search: string): boolean | null {
        const searchLower = search.toLowerCase();

        // ตรวจสอบความใกล้เคียงกับค่าของ CommentStatus
        if (searchLower.startsWith("pe")) {
          return false;
        } else if (searchLower.startsWith("co")) {
          return true;
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
      if (mappedStatus != undefined) {
        orConditions.push({ status: mappedStatus as boolean });
      }

      orConditions.push({
        message: {
          contains: search as string,
        },
      });

      orConditions.push({
        user: {
          profile: {
            name: {
              contains: search as string,
            },
          },
        },
      });

      orConditions.push({
        patrolResult: {
          itemZone: {
            zone: {
              name: {
                contains: search as string,
              },
            },
          },
        },
      });

      orConditions.push({
        patrolResult: {
          itemZone: {
            item: {
              name: {
                contains: search as string,
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

    const comments = await prisma.comment.findMany({
      where: whereConditions,
      include: {
        patrolResult: {
          select: {
            zoneId: true,
            itemZone: {
              select: {
                zone: true,
                item: {
                  include: {
                    checklist: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            role: true,
            email: true,
            createdAt: true,
            profile: {
              select: {
                id: true,
                name: true,
                tel: true,
                image: true,
              },
            },
          },
        },
      },
    });

    let result = comments;
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับยืนยัน Comment
 * Input:
 * - req.params.id: number (ID ของ Comment ที่ต้องการยืนยัน)
 * Output: JSON object ข้อมูล Comment หลังจากยืนยัน
 **/
export async function confirmComment(req: Request, res: Response) {
  try {
    const commentId = parseInt(req.params.id, 10);

    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        status: true,
      },
    });

    const result = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        patrolResult: {
          select: {
            zoneId: true,
            itemZone: {
              select: {
                zone: true,
                item: {
                  include: {
                    checklist: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            role: true,
            email: true,
            createdAt: true,
            profile: {
              select: {
                id: true,
                name: true,
                tel: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const message = `confirm_comment`;
    await createNotification({
      message: message,
      type: "information" as NotificationType,
      url: ``,
      userId: result?.user.id,
    });

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}
