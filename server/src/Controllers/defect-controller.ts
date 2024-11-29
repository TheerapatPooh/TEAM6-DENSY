import { prisma } from "@Utils/database.js";
import { Request, Response } from "express";
import transformKeys, { keyMap } from "@Utils/key-map.js";
import { createNotification } from "./util-controller";
import { NotificationType } from "@prisma/client";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

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
        result: {
          some: {
            pr_id: parseInt(patrolResultId),
          },
        },
        patrolChecklist: {
          some: {
            ptcl_us_id: parseInt(userId),
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
        df_name: name,
        df_description: description,
        df_type: type,
        df_status: status,
        user: { connect: { us_id: parseInt(defectUserId) } },
        patrolResult: { connect: { pr_id: parseInt(patrolResultId) } },
      },
    });

    const updateResult = async (patrolResultId: number) => {
      try {
        const result = await prisma.patrolResult.findUnique({
          where: {
            pr_id: parseInt(patrolResultId.toString()), // Ensure it's an integer
          },
        });

        if (!result) {
          console.error("Patrol result not found");
          return;
        }

        const updatedResult = await prisma.patrolResult.update({
          where: { pr_id: parseInt(patrolResultId.toString()) },
          data: {
            pr_status: false,
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
            im_path: imagePath,
            im_update_by: parseInt(defectUserId),
          },
        });

        if (image) {
          await prisma.defectImage.create({
            data: {
              dfim_df_id: newDefect.df_id,
              dfim_im_id: image.im_id,
            },
          });
        }
      }
    } else {
      console.error("No files uploaded or incorrect file structure.");
    }
    const message = `Your has been reported defect.`;
    const supervisor = parseInt(supervisorId, 10);
  
     await createNotification({
       nt_message: message,
       nt_type: "information" as NotificationType,
       nt_url: `/defect/${newDefect.df_id}`,
       nt_us_id: supervisor,
     });

    let result = transformKeys(newDefect, keyMap);

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

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
        df_id: Number(id),
      },
    });

    if (!defect) {
      res.status(404).json({ message: "Defect not found" });
      return;
    }

    const validPatrol = await prisma.patrol.findFirst({
      where: {
        result: {
          some: {
            pr_id: defect.df_pr_id,
          },
        },
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

    let result = transformKeys(defect, keyMap);

    res.status(200).json(result);
    return;
  } catch (err) {
    res.status(500).send(err);
    return;
  }
}

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
                us_id: userId,
              },
            },
          },
        },
      },
      include: {
        patrolResult: {
          select: {
            pr_itze_ze_id: true,
          },
        },
        user: {
          select: {
            us_id: true,
            us_role: true,
            us_email: true,
            us_created_at: true,
            profile: {
              select: {
                pf_id: true,
                pf_name: true,
                pf_tel: true,
                image: true,
              },
            },
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
  } catch (err) {
    res.status(500).send(err);
    return;
  }
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '../../uploads');


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
      where: { df_id: Number(id) },
    });
    if (!defect) {
      res.status(404).json({ message: 'Defect not found' });
      return;
    }

    const validPatrol = await prisma.patrol.findFirst({
      where: {
        result: { some: { pr_id: defect.df_pr_id } },
        patrolChecklist: { some: { ptcl_us_id: userId } },
      },
    });
    if (!validPatrol) {
      res.status(403).json({ message: 'You are not associated with this Patrol' });
      return;
    }

    if (newImageFiles?.length) {
      const existingDefectImages = await prisma.defectImage.findMany({
        where: { dfim_df_id: Number(id) },
        select: { dfim_im_id: true },
      });

      const imageIdsToDelete = existingDefectImages.map((img) => img.dfim_im_id);

      const imagesToDelete = await prisma.image.findMany({
        where: { im_id: { in: imageIdsToDelete } },
        select: { im_path: true },
      });

      for (const image of imagesToDelete) {
        const filePath = path.join(uploadsPath, image.im_path);
        try {
          fs.unlinkSync(filePath);
          console.log(`File at ${filePath} deleted successfully.`);
        } catch (err) {
          console.error(`Failed to delete file at ${filePath}:`, err);
        }
      }

      await prisma.defectImage.deleteMany({
        where: { dfim_df_id: Number(id) },
      });
      await prisma.image.deleteMany({
        where: { im_id: { in: imageIdsToDelete } },
      });

      for (const file of newImageFiles) {
        const image = await prisma.image.create({
          data: {
            im_path: file.filename,
            im_update_by: parseInt(defectUserId, 10),
          },
        });
        await prisma.defectImage.create({
          data: {
            dfim_df_id: Number(id),
            dfim_im_id: image.im_id,
          },
        });
      }
    }

    const updatedDefect = await prisma.defect.update({
      where: { df_id: Number(id) },
      data: {
        df_name: name,
        df_description: description,
        df_type: type,
        df_status: status,
        user: { connect: { us_id: parseInt(defectUserId) } },
        patrolResult: { connect: { pr_id: parseInt(patrolResultId) } },
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
        df_id: Number(id),
      },
    });

    if (!defect) {
      res.status(404).json({ message: "Defect not found" });
      return;
    }
    const existingDefectImages = await prisma.defectImage.findMany({
      where: { dfim_df_id: Number(id) },
      select: { dfim_im_id: true },
    });

    const imageIdsToDelete = existingDefectImages.map((img) => img.dfim_im_id);

    const imagesToDelete = await prisma.image.findMany({
      where: { im_id: { in: imageIdsToDelete } },
      select: { im_path: true },
    });

    for (const image of imagesToDelete) {
      const filePath = path.join(uploadsPath, image.im_path);
      try {
        fs.unlinkSync(filePath);
        console.log(`File at ${filePath} deleted successfully.`);
      } catch (err) {
        console.error(`Failed to delete file at ${filePath}:`, err);
      }
    }

    await prisma.defectImage.deleteMany({
      where: { dfim_df_id: Number(id) },
    });
    await prisma.image.deleteMany({
      where: { im_id: { in: imageIdsToDelete } },
    });
    
    const validPatrol = await prisma.patrol.findFirst({
      where: {
        result: {
          some: {
            pr_id: defect.df_pr_id,
          },
        },
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

    await prisma.defect.delete({
      where: {
        df_id: Number(id),
      },
    });
    res.status(200).json({ message: "Defect deleted successfully" });
    return;
  } catch (err) {
    res.status(500).send(err);
    return;
  }
}
