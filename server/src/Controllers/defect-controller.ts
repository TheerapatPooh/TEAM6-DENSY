import { prisma } from '@Utils/database.js'
import { Request, Response } from 'express'
import transformKeys, { keyMap } from '@Utils/key-map.js';

export async function createDefect(req: Request, res: Response) {
    try {
        const role = (req as any).user.role;
        const userId = (req as any).user.userId;
        const { name, description, type, status, defectUserId, patrolResultId } = req.body;
        const imageFiles = req.files as Express.Multer.File[]; // Cast to an array of Multer files

        if (role !== 'admin' && role !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Admins or Inspectors only" });
            return
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
            res.status(404).json({ message: "You are not associated with this Patrol or PatrolResult not found" });
            return
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

                console.log("Patrol result updated successfully:", updatedResult);
                return updatedResult;
            } catch (error) {
                console.error("Error updating patrol result:", error);
            }
        };
        updateResult(patrolResultId)
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

        if (role !== 'admin' && role !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Admins or Inspectors only" });
            return
        }

        const { id } = req.params;

        const defect = await prisma.defect.findUnique({
            where: {
                df_id: Number(id),
            },
        });

        if (!defect) {
            res.status(404).json({ message: "Defect not found" });
            return
        }

        const validPatrol = await prisma.patrol.findFirst({
            where: {
                result: {
                    some: {
                        pr_id: defect.df_pr_id,
                    }
                },
                patrolChecklist: {
                    some: {
                        ptcl_us_id: userId,
                    }
                }
            }
        });

        if (!validPatrol) {
            res.status(404).json({ message: "You are not associated with this Patrol" });
            return
        }

        let result = transformKeys(defect, keyMap);

        res.status(200).json(result);
        return
    } catch (err) {
        res.status(500).send(err);
        return
    }
}

export async function getAllDefect(req: Request, res: Response) {
    try {
        const role = (req as any).user.role;
        const userId = (req as any).user.userId;

        if (role !== 'admin' && role !== 'supervisor') {
            res.status(403).json({ message: "Access Denied: Admins or Supervisor only" });
            return
        }

        const defects = await prisma.defect.findMany({
            where: {
                patrolResult: {
                    itemZone: {
                        zone: {
                            supervisor: {
                                us_id: userId
                            }
                        }
                    }
                },
            },
            include: {
                patrolResult: {
                    select: {
                        pr_itze_ze_id: true
                    }
                },
                user: {
                    select: {
                        us_id: true,
                        us_role: true,
                        us_email: true,
                        profile: {
                            select: {
                                pf_id: true,
                                pf_name: true,
                                image: true
                            }
                        } 
                    }
                },
                image:{
                    select: {
                        image: {
                            select: {
                                im_id: true,
                                im_path: true,
                                user: true
                            }
                        }
                    }
                }
            }
        });

        let result = defects.map((defect: any) => transformKeys(defect, keyMap));
        res.status(200).json(result);
        return
    } catch (err) {
        res.status(500).send(err);
        return
    }
}

export async function updateDefect(req: Request, res: Response) {
    try {
        const role = (req as any).user.role;
        const userId = (req as any).user.userId;

        const { id } = req.params;
        const { name, description, type, status, userId: defectUserId, patrolResultId } = req.body;

        if (role !== 'admin' && role !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Admins or Inspectors only" });
            return
        }

        const defect = await prisma.defect.findUnique({
            where: {
                df_id: Number(id),
            }
        });

        if (!defect) {
            res.status(404).json({ message: "Defect not found" });
            return
        }

        const validPatrol = await prisma.patrol.findFirst({
            where: {
                result: {
                    some: {
                        pr_id: defect.df_pr_id,
                    }
                },
                patrolChecklist: {
                    some: {
                        ptcl_us_id: userId,
                    }
                }
            }
        });

        if (!validPatrol) {
            res.status(404).json({ message: "You are not associated with this Patrol" });
            return
        }

        const updatedDefect = await prisma.defect.update({
            where: {
                df_id: Number(id),
            },
            data: {
                df_name: name,
                df_description: description,
                df_type: type,
                df_status: status,
                user: { connect: { us_id: defectUserId } },
                patrolResult: { connect: { pr_id: patrolResultId } }
            },
        });

        const result = {
            name: updatedDefect.df_name,
            description: updatedDefect.df_description,
            type: updatedDefect.df_type,
            status: updatedDefect.df_status,
            userId: updatedDefect.df_us_id,
            patrolResultId: updatedDefect.df_pr_id
        };

        res.status(200).json(result);
        return
    } catch (err) {
        res.status(500).send(err);
        return
    }
}

export async function deleteDefect(req: Request, res: Response): Promise<void> {
    try {
        const role = (req as any).user.role;
        const userId = (req as any).user.userId;

        if (role !== 'admin' && role !== 'inspector') {
            res.status(403).json({ message: "Access Denied: Admins or Inspectors only" });
            return
        }

        const { id } = req.params;

        const defect = await prisma.defect.findUnique({
            where: {
                df_id: Number(id),
            }
        });

        if (!defect) {
            res.status(404).json({ message: "Defect not found" });
            return
        }

        const validPatrol = await prisma.patrol.findFirst({
            where: {
                result: {
                    some: {
                        pr_id: defect.df_pr_id,
                    }
                },
                patrolChecklist: {
                    some: {
                        ptcl_us_id: userId,
                    }
                }
            }
        });

        if (!validPatrol) {
            res.status(404).json({ message: "You are not associated with this Patrol" });
            return
        }

        await prisma.defect.delete({
            where: {
                df_id: Number(id),
            }
        });
        res.status(200).json({ message: 'Defect deleted successfully', });
        return
    } catch (err) {
        res.status(500).send(err);
        return
    }
}