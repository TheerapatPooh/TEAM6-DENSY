import prisma from "@Utils/database.js";
import { Request, Response } from "express";
import { createNotification } from "@Controllers/util-controller.js";
import { DefectStatus, ItemType, NotificationType } from "@prisma/client";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import { users } from '../Utils/data/users';

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสร้าง Defect ใหม่
 * Input: 
 * - (req as any).user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * - req.body: { name: String, description: String, type: ItemType, status: DefectStatus, defectUserId: Int, patrolResultId: Int, supervisorId: Int }
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
    const imageFiles = req.files as Express.Multer.File[]; // Cast to an array of Multer files

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
        status: "reported" as DefectStatus,
        startTime: new Date(),
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

    let result = await prisma.defect.findFirst({
      where: { id: newDefect.id },
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
    })

    res.status(201).json(result);
  } catch (err) {
    res.status(500)
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Defect 
 * Input: 
 * - (req as any).user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * - req.params: { id: Int} (ID ของ Defect)
 * Output: JSON object ข้อมูล Defect และข้อมูล patrolResult ที่เกี่ยวข้อง
**/
export async function getDefect(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const defect = await prisma.defect.findUnique({
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
                        image: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            role: true,
            email: true,
            createdAt: true,
            profile: {
              include: {
                image: true
              }
            }
          }
        },
        patrolResult: {
          select: {
            itemZone: {
              select: {
                zone: true
              }
            }
          }
        }
      }
    });

    if (!defect) {
      res.status(404).json({ message: "Defect not found" });
      return;
    }

    let result = defect

    res.status(200).json(result);
    return;
  } catch (err) {
    res.status(500)
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Defect ทั้งหมด
 * Input: 
 * - (req as any).user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON array ข้อมูล Defect ทั้งหมด รวมถึงข้อมูล patrolResult และ user ที่เกี่ยวข้อง 
**/
export async function getAllDefects(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { status, type, startDate, endDate, search } = req.query;
    // สร้างเงื่อนไขหลัก
    const whereConditions: any = {
      patrolResult: {
        itemZone: {
          zone: {
            supervisor: {
              id: userId,
            },
          },
        },
      },
    };

    const andConditions: any[] = [];

    // เงื่อนไขการกรองตาม status
    if (status) {
      andConditions.push(
        { status: status }
      );
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
        console.error('Invalid date range:', startDate, endDate);
      }
    }

    // เงื่อนไขการค้นหา (search)
    if (search) {
      const searchId = parseInt(search as string, 10);

      function mapSearchToStatus(search: string): DefectStatus | null {
        const searchLower = search.toLowerCase();

        // ตรวจสอบความใกล้เคียงกับค่าของ DefectStatus
        if (searchLower.startsWith('rep')) {
          return DefectStatus.reported;
        } else if (searchLower.startsWith('in')) {
          return DefectStatus.in_progress;
        } else if (searchLower.startsWith('pe')) {
          return DefectStatus.pending_inspection;
        } else if (searchLower.startsWith('res')) {
          return DefectStatus.resolved;
        } else if (searchLower.startsWith('co')) {
          return DefectStatus.completed;
        }
        // ถ้าไม่มีค่าใดที่ตรงกับการค้นหา
        return null;
      }

      function mapSearchToType(search: string): ItemType | null {
        const searchLower = search.toLowerCase();

        // ตรวจสอบความใกล้เคียงกับค่าของ DefectStatus
        if (searchLower.startsWith('sa')) {
          return ItemType.safety;
        } else if (searchLower.startsWith('en')) {
          return ItemType.environment;
        } else if (searchLower.startsWith('ma')) {
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
        patrolResult: {
          select: {
            zoneId: true,
            itemZone: {
              select: {
                zone: true,
              }
            }
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

    let result = defects
    res.status(200).json(result);
    return;
  } catch (err) {
    res.status(500)
    return;
  }
}

function getUploadsPath(): string {
  const currentDir = process.cwd();
  return path.join(currentDir, 'uploads'); // Adjust path as needed
}

const uploadsPath = getUploadsPath();

/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัปเดต Defect 
 * Input: 
 * - (req as any).user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * - req.params: { id: Int} (ID ของ Defect ที่จะอัปเดต)
 * - req.body: {name: String, description: String, type: ItemType, status: DefectStatus, defectUserId: Int, patrolResultId: Int }
 * - req.file: Array<Express.Multer.File> (ไฟล์รูปภาพใหม่)
 * Output: JSON object ข้อมูล Defect หลังการอัปเดต
**/
export async function updateDefect(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
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

    const defect = await prisma.defect.findUnique({
      where: { id: Number(id) },
    });
    if (!defect) {
      res.status(404).json({ message: 'Defect not found' });
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

    await prisma.defect.update({
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

    const result = await prisma.defect.findUnique({
      where: { id: Number(id) },
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
              include: {
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
        user: {
          select: {
            id: true,
            role: true,
            email: true,
            createdAt: true,
            profile: {
              include: {
                image: true
              }
            }
          }
        }
      },
    })

    res.status(200).json(result);
  } catch (err) {
    res.status(500)
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับการแก้ไข Defect 
 * Input: 
 * - (req as any).user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * - req.params: { id: Int} (ID ของ Defect ที่จะ resolved)
 * - req.body: { defectUserId: Int }
 * - req.file: Array<Express.Multer.File> (ไฟล์รูปภาพใหม่)
 * Output: JSON object ข้อมูล Defect หลังการอัปเดต
**/
export async function resolveDefect(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { defectUserId } = req.body;
    const newImageFiles = req.files as Express.Multer.File[];

    const defect = await prisma.defect.findUnique({
      where: { id: Number(id) },
    });
    if (!defect) {
      res.status(404).json({ message: 'Defect not found' });
      return;
    }

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
    

    await prisma.defect.update({
      where: { id: Number(id) },
      data: {
        status: 'resolved' as DefectStatus,
      },
    });

    const result = await prisma.defect.findUnique({
      where: { id: Number(id) },
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
              include: {
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
        user: {
          select: {
            id: true,
            role: true,
            email: true,
            createdAt: true,
            profile: {
              include: {
                image: true
              }
            }
          }
        }
      },
    })
  

    res.status(200).json(result);
  } catch (err) {
    res.status(500)
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
    res.status(500);
    return;
  }
}



/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Comment ทั้งหมด
 * Input: 
 * - (req as any).user.userId: Int (ID ของผู้ใช้งานที่กำลังล็อกอิน)
 * Output: JSON array ข้อมูล Comment ทั้งหมด รวมถึงข้อมูล patrolResult และ user ที่เกี่ยวข้อง 
**/
export async function getAllComments(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { status, startDate, endDate, search } = req.query;
    // สร้างเงื่อนไขหลัก
    const whereConditions: any = {
      patrolResult: {
        itemZone: {
          zone: {
            supervisor: {
              id: userId,
            },
          },
        },
      },
    };

    const andConditions: any[] = [];

    // เงื่อนไขการกรองตาม status
    if (status !== undefined) {
      const statusBoolean = status === 'true';
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
        console.error('Invalid date range:', startDate, endDate);
      }
    }

    // เงื่อนไขการค้นหา (search)
    if (search) {
      const searchId = parseInt(search as string, 10);

      function mapSearchToStatus(search: string): boolean | null {
        const searchLower = search.toLowerCase();

        // ตรวจสอบความใกล้เคียงกับค่าของ CommentStatus
        if (searchLower.startsWith('pe')) {
          return false;
        } else if (searchLower.startsWith('co')) {
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
        }
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
              }
            },
          }
        }
      });

      orConditions.push({
        patrolResult: {
          itemZone: {
            item: {
              name: {
                contains: search as string,
              }
            },
          }
        }
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
                    checklist: true
                  }
                }
              }
            }
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

    let result = comments
    res.status(200).json(result);
    return;
  } catch (err) {
    res.status(500)
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
                    checklist: true
                  }
                }
              }
            }
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
    res.status(500);
    return;
  }
}
