import { prisma } from '@Utils/database.js'
import { Request, Response } from 'express'

export async function createPreset(req: Request, res: Response) {
    try {
        const userRole = (req as any).user.role;
        if (userRole !== 'admin') {
            res.status(403).json({ message: "Access Denied: Admins only" });
            return
        }

        const { title, description, checklists, userId } = req.body;

        if (!title || !description || !checklists || !userId) {
            res.status(400).json({ message: "Missing required fields" });
            return
        }


        const newPreset = await prisma.preset.create({
            data: {
                title: title,
                description: description,
                version: 1,
                latest: true,
                updatedAt: new Date(),
                updatedBy: userId

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
        res.status(201).json({ message: "Preset created successfully", preset: newPreset });
    } catch (error) {
        console.error(error)
    }
}

export async function updatePreset(req: Request, res: Response) {
    try {
        const userRole = (req as any).user.role;
        if (userRole !== "admin") {
            res.status(403).json({ message: "Access Denied: Admins only" });
            return;
        }

        const { title, description, checklists, userId } = req.body;
        const presetId = parseInt(req.params.id, 10)

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

        res.status(200).json({ message: "Preset updated successfully", preset: newPreset, });
    } catch (error) {
        console.error(error)
    }
}

export async function getPreset(req: Request, res: Response) {
    try {
        const presetId = parseInt(req.params.id, 10)
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
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!preset) {
            res.status(404)
            return
        }
        let result = preset
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

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
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!presets.length) {
            res.status(404)
            return
        }

        let result = presets
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}