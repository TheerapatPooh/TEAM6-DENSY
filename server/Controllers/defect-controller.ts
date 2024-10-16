import { prisma } from '../Utils/database'
import { Request, Response } from 'express'

export async function createDefect(req: Request, res: Response) {
    try {
        const role = (req as any).user.role;
        const userId = (req as any).user.userId;

        const { name, description, type, status, userId: defectUserId, patrolResultId } = req.body;

        if (role !== 'admin' && role !== 'inspector') {
            return res.status(403).json({ message: "Access Denied: Admins or Inspectors only" });
        }

        const validPatrol = await prisma.patrol.findFirst({
            where: {
                patrol_result: {
                    some: {
                        pr_id: patrolResultId,
                    }
                },
                checklist: {
                    some: {
                        ptcl_us_id: userId,
                    }
                }
            }
        });

        if (!validPatrol) {
            return res.status(404).json({ message: "You are not associated with this Patrol or PatrolResult not found" });
        }

        const newDefect = await prisma.defect.create({
            data: {
                df_name: name,
                df_description: description,
                df_type: type,
                df_status: status,
                user: { connect: { us_id: defectUserId } },
                patrol_result: { connect: { pr_id: patrolResultId } }
            }
        });

        const formattedDefect = {
            name: newDefect.df_name,
            description: newDefect.df_description,
            type: newDefect.df_type,
            status: newDefect.df_status,
            userId: newDefect.df_us_id,
            patrolResultId: newDefect.df_pr_id
        };

        res.status(201).json(formattedDefect);

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
            return res.status(403).json({ message: "Access Denied: Admins or Inspectors only" });
        }

        const { id } = req.params;

        const defect = await prisma.defect.findUnique({
            where: {
                df_id: Number(id),
            },
        });

        if (!defect) {
            return res.status(404).json({ message: "Defect not found" });
        }

        const validPatrol = await prisma.patrol.findFirst({
            where: {
                patrol_result: {
                    some: {
                        pr_id: defect.df_pr_id,
                    }
                },
                checklist: {
                    some: {
                        ptcl_us_id: userId,
                    }
                }
            }
        });

        if (!validPatrol) {
            return res.status(404).json({ message: "You are not associated with this Patrol" });
        }

        const formattedDefect = {
            name: defect.df_name,
            description: defect.df_description,
            type: defect.df_type,
            status: defect.df_status,
            userId: defect.df_us_id,
            patrolResultId: defect.df_pr_id
        };

        res.status(200).json(formattedDefect);
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function getAllDefect(req: Request, res: Response) {
    try {
        const role = (req as any).user.role;
        const userId = (req as any).user.userId;

        if (role !== 'admin' && role !== 'inspector') {
            return res.status(403).json({ message: "Access Denied: Admins or Inspectors only" });
        }

        const patrolId = parseInt(req.params.id, 10);

        const validPatrol = await prisma.patrol.findFirst({
            where: {
                patrol_result: {
                    some: {
                        pr_id: patrolId,
                    }
                },
                checklist: {
                    some: {
                        ptcl_us_id: userId,
                    }
                }
            }
        });

        if (!validPatrol) {
            return res.status(404).json({ message: "You are not associated with this Patrol" });
        }

        const defects = await prisma.defect.findMany({
            where: {
                df_pr_id: patrolId,
            }
        });

        if (defects.length === 0) {
            return res.status(404).json({ message: "Defect not found" });
        }

        const formattedDefects = defects.map(defect => ({
            name: defect.df_name,
            description: defect.df_description,
            type: defect.df_type,
            status: defect.df_status,
            userId: defect.df_us_id,
            patrolResultId: defect.df_pr_id
        }));

        res.status(200).json(formattedDefects);
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function updateDefect(req: Request, res: Response) {
    try {
        const role = (req as any).user.role;
        const userId = (req as any).user.userId;

        const { id } = req.params;
        const { name, description, type, status, userId: defectUserId, patrolResultId } = req.body;

        if (role !== 'admin' && role !== 'inspector') {
            return res.status(403).json({ message: "Access Denied: Admins or Inspectors only" });
        }

        const defect = await prisma.defect.findUnique({
            where: {
                df_id: Number(id),
            }
        });

        if (!defect) {
            return res.status(404).json({ message: "Defect not found" });
        }

        const validPatrol = await prisma.patrol.findFirst({
            where: {
                patrol_result: {
                    some: {
                        pr_id: defect.df_pr_id,
                    }
                },
                checklist: {
                    some: {
                        ptcl_us_id: userId,
                    }
                }
            }
        });

        if (!validPatrol) {
            return res.status(404).json({ message: "You are not associated with this Patrol" });
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
                patrol_result: { connect: { pr_id: patrolResultId } }
            },
        });

        const formattedDefect = {
            name: updatedDefect.df_name,
            description: updatedDefect.df_description,
            type: updatedDefect.df_type,
            status: updatedDefect.df_status,
            userId: updatedDefect.df_us_id,
            patrolResultId: updatedDefect.df_pr_id
        };

        res.status(200).json(formattedDefect);
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function deleteDefect(req: Request, res: Response) {
    try {
        const role = (req as any).user.role;
        const userId = (req as any).user.userId;

        if (role !== 'admin' && role !== 'inspector') {
            return res.status(403).json({ message: "Access Denied: Admins or Inspectors only" });
        }

        const { id } = req.params;

        const defect = await prisma.defect.findUnique({
            where: {
                df_id: Number(id),
            }
        });

        if (!defect) {
            return res.status(404).json({ message: "Defect not found" });
        }

        const validPatrol = await prisma.patrol.findFirst({
            where: {
                patrol_result: {
                    some: {
                        pr_id: defect.df_pr_id,
                    }
                },
                checklist: {
                    some: {
                        ptcl_us_id: userId,
                    }
                }
            }
        });

        if (!validPatrol) {
            return res.status(404).json({ message: "You are not associated with this Patrol" });
        }

        const deletedDefect = await prisma.defect.delete({
            where: {
                df_id: Number(id),
            }
        });

        const formattedDefect = {
            name: deletedDefect.df_name,
            description: deletedDefect.df_description,
            type: deletedDefect.df_type,
            status: deletedDefect.df_status,
            userId: deletedDefect.df_us_id,
            patrolResultId: deletedDefect.df_pr_id
        };

        res.status(200).json(formattedDefect);
    } catch (err) {
        res.status(500).send(err);
    }
}
