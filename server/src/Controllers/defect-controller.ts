import { prisma } from "@Utils/database.js";
import { Request, Response } from "express";
import { createNotification } from "./util-controller.js";
import { NotificationType } from "@prisma/client";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสร้าง Defect ใหม่
 * Input: 
 * - (req as any).user.role: String (ต้องเป็น "admin" หรือ "inspector")
 * - (req as any).user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * - req.body: { name: String, description: String, type: ItemType, status: DefectStatus, defectUserId: Int, patrolResultId: Int, supervisorId: Int }
 * - req.files: Array<Express.Multer.File> (ไฟล์รูปภาพใหม่)
 * Output: JSON object ข้อมูล Defect ที่ถูกสร้าง พร้อมกับอัปเดตสถานะของ patrolResult
 **/
export async function createDefect(req: Request, res: Response) {
  try {
    const role = (req as any).user.role;
    const userId = (req as any).user.userId;
    const {
      name,
      description,
      type,
      status,
      defectUserId,
      patrolResultId,
      supervisorId,
    } = req.body;
    const imageFiles = req.files as Express.Multer.File[]; // Cast to an array of Multer files

    if (role !== "admin" && role !== "inspector") {
      res
        .status(403)
        .json({ message: "Access Denied: Admins or Inspectors only" });
      return;
    }

    const validPatrol = await prisma.patrol.findFirst({
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
      res
        .status(404)
        .json({
          message:
            "You are not associated with this Patrol or PatrolResult not found",
        });
      return;
    }

    const newDefect = await prisma.defect.create({
      data: {
        name: name,
        description: description,
        type: type,
        status: status,
        user: { connect: { id: parseInt(defectUserId) } },
        patrolResult: { connect: { id: parseInt(patrolResultId) } },
      },
    });

    const updateResult = async (patrolResultId: number) => {
      try {
        const result = await prisma.patrolResult.findUnique({
          where: {
            id: parseInt(patrolResultId.toString()), // Ensure it's an Integer
          },
        });

        if (!result) {
          console.error("Patrol result not found");
          return;
        }

        const updatedResult = await prisma.patrolResult.update({
          where: { id: parseInt(patrolResultId.toString()) },
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
        const imagePath = imageFile.filename; // Get the path of each uploaded file
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
      message: message,
      type: "information" as NotificationType,
      url: `/defect/${newDefect.id}`,
      userId: supervisor,
    });

    let result = newDefect

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Defect 
 * Input: 
 * - (req as any).user.role: String (ต้องเป็น "admin" หรือ "inspector")
 * - (req as any).user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * - req.params: { id: Int} (ID ของ Defect)
 * Output: JSON object ข้อมูล Defect และข้อมูล patrolResult ที่เกี่ยวข้อง
 **/
export async function getDefect(req: Request, res: Response) {
  try {
    const role = (req as any).user.role;
    const userId = (req as any).user.userId;

    if (role !== "admin" && role !== "inspector") {
      res
        .status(403)
        .json({ message: "Access Denied: Admins or Inspectors only" });
      return;
    }

    const { id } = req.params;

    const defect = await prisma.defect.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!defect) {
      res.status(404).json({ message: "Defect not found" });
      return;
    }

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

    if (!validPatrol) {
      res
        .status(404)
        .json({ message: "You are not associated with this Patrol" });
      return;
    }

    let result = defect

    res.status(200).json(result);
    return;
  } catch (err) {
    res.status(500).send(err);
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Defect ทั้งหมด
 * Input: 
 * - (req as any).user.role: String (ต้องเป็น "admin" หรือ "inspector")
 * - (req as any).user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON array ข้อมูล Defect ทั้งหมด รวมถึงข้อมูล patrolResult และ user ที่เกี่ยวข้อง 
 **/
export async function getAllDefect(req: Request, res: Response) {
  try {
    const role = (req as any).user.role;
    const userId = (req as any).user.userId;

    if (role !== "admin" && role !== "supervisor") {
      res
        .status(403)
        .json({ message: "Access Denied: Admins or Supervisor only" });
      return;
    }

    const defects = await prisma.defect.findMany({
      where: {
        patrolResult: {
          itemZone: {
            zone: {
              supervisor: {
                id: userId,
              },
            },
          },
        },
      },
      include: {
        patrolResult: {
          select: {
            zoneId: true,
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
                user: true,
              },
            },
          },
        },
      },
    });

    let result = defects
    res.status(200).json(result);
    return;
  } catch (err) {
    res.status(500).send(err);
    return;
  }
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '../../uploads');

/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัปเดต Defect 
 * Input: 
 * - (req as any).user.role: String (ต้องเป็น "admin" หรือ "inspector")
 * - (req as any).user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * - req.params: { id: Int} (ID ของ Defect ที่จะอัปเดต)
 * - req.body: {name: String, description: String, type: ItemType, status: DefectStatus, defectUserId: Int, patrolResultId: Int }
 * - req.file: Array<Express.Multer.File> (ไฟล์รูปภาพใหม่)
 * Output: JSON object ข้อมูล Defect หลังการอัปเดต
 **/
export async function updateDefect(req: Request, res: Response): Promise<void> {
  try {
    const { role, userId } = (req as any).user;
    const { id } = req.params;
    const {
      name,
      description,
      type,
      status,
      defectUserId,
      patrolResultId,
    } = req.body;
    const newImageFiles = req.files as Express.Multer.File[];

    if (role !== 'admin' && role !== 'inspector') {
      res.status(403).json({ message: 'Access Denied: Admins or Inspectors only' });
      return;
    }

    const defect = await prisma.defect.findUnique({
      where: { id: Number(id) },
    });
    if (!defect) {
      res.status(404).json({ message: 'Defect not found' });
      return;
    }

    const validPatrol = await prisma.patrol.findFirst({
      where: {
        results: { some: { id: defect.patrolResultId } },
        patrolChecklists: { some: { userId: userId } },
      },
    });
    if (!validPatrol) {
      res.status(403).json({ message: 'You are not associated with this Patrol' });
      return;
    }

    if (newImageFiles?.length) {
      const existingDefectImages = await prisma.defectImage.findMany({
        where: { defectId: Number(id) },
        select: { imageId: true },
      });

      const imageIdsToDelete = existingDefectImages.map((img) => img.imageId);

      const imagesToDelete = await prisma.image.findMany({
        where: { id: { in: imageIdsToDelete } },
        select: { path: true },
      });

      for (const image of imagesToDelete) {
        const filePath = path.join(uploadsPath, image.path);
        try {
          fs.unlinkSync(filePath);
          console.log(`File at ${filePath} deleted successfully.`);
        } catch (err) {
          console.error(`Failed to delete file at ${filePath}:`, err);
        }
      }

      await prisma.defectImage.deleteMany({
        where: { defectId: Number(id) },
      });
      await prisma.image.deleteMany({
        where: { id: { in: imageIdsToDelete } },
      });

      for (const file of newImageFiles) {
        const image = await prisma.image.create({
          data: {
            path: file.filename,
            updatedBy: parseInt(defectUserId, 10),
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

    const updatedDefect = await prisma.defect.update({
      where: { id: Number(id) },
      data: {
        name: name,
        description: description,
        type: type,
        status: status,
        user: { connect: { id: parseInt(defectUserId) } },
        patrolResult: { connect: { id: parseInt(patrolResultId) } },
      },
    });

    res.status(200).json({
      message: 'Defect updated successfully',
      defect: updatedDefect,
    });
  } catch (err) {
    console.error('Error updating defect:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับลบ Defect 
 * Input: 
 * - (req as any).user.role: String (ต้องเป็น "admin" หรือ "inspector")
 * - (req as any).user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * - req.params: { id: Int} (ID ของ Defect ที่จะลบ)
 * Output: JSON message ยืนยันการลบ Defect สำเร็จ
 **/
export async function deleteDefect(req: Request, res: Response): Promise<void> {
  try {
    const role = (req as any).user.role;
    const userId = (req as any).user.userId;

    if (role !== "admin" && role !== "inspector") {
      res
        .status(403)
        .json({ message: "Access Denied: Admins or Inspectors only" });
      return;
    }

    const { id } = req.params;

    const defect = await prisma.defect.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!defect) {
      res.status(404).json({ message: "Defect not found" });
      return;
    }
    const existingDefectImages = await prisma.defectImage.findMany({
      where: { defectId: Number(id) },
      select: { imageId: true },
    });

    const imageIdsToDelete = existingDefectImages.map((img) => img.imageId);

    const imagesToDelete = await prisma.image.findMany({
      where: { id: { in: imageIdsToDelete } },
      select: { path: true },
    });

    for (const image of imagesToDelete) {
      const filePath = path.join(uploadsPath, image.path);
      try {
        fs.unlinkSync(filePath);
        console.log(`File at ${filePath} deleted successfully.`);
      } catch (err) {
        console.error(`Failed to delete file at ${filePath}:`, err);
      }
    }

    await prisma.defectImage.deleteMany({
      where: { defectId: Number(id) },
    });
    await prisma.image.deleteMany({
      where: { id: { in: imageIdsToDelete } },
    });

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

    if (!validPatrol) {
      res
        .status(404)
        .json({ message: "You are not associated with this Patrol" });
      return;
    }

    await prisma.defect.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ message: "Defect deleted successfully" });
    return;
  } catch (err) {
    res.status(500).send(err);
    return;
  }
}
