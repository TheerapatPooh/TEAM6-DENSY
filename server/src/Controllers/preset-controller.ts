import { prisma } from '@Utils/database.js'
import { Request, Response } from 'express'
import transformKeys, { keyMap } from '@Utils/key-map.js'

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
                ps_title: title,
                ps_description: description,
                ps_version: 1,
                ps_latest: true,
                ps_update_at: new Date(),
                ps_update_by: userId

            },
        });
        for (const checklist of checklists) {
            const { id } = checklist.checklist;
            await prisma.presetChecklist.create({
                data: {
                    pscl_ps_id: newPreset.ps_id,
                    pscl_cl_id: id,
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
            where: { ps_id: presetId },
        });

        if (!currentPreset) {
            res.status(404).json({ message: "Preset not found" });
            return;
        }

        await prisma.preset.update({
            where: { ps_id: presetId },
            data: { ps_latest: false },
        });

        const newPreset = await prisma.preset.create({
            data: {
                ps_title: title,
                ps_description: description,
                ps_version: currentPreset.ps_version + 1,
                ps_latest: true,
                ps_update_at: new Date(),
                ps_update_by: userId,
            },
        });

        for (const checklist of checklists) {
            const { id } = checklist.checklist;
            await prisma.presetChecklist.create({
                data: {
                    pscl_ps_id: newPreset.ps_id,
                    pscl_cl_id: id,
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
            where: { ps_id: presetId },
            select: {
                ps_id: true,
                ps_title: true,
                ps_description: true,
                presetChecklist: {
                    select: {
                        checklist: {
                            select: {
                                cl_id: true,
                                cl_title: true,
                                item: {
                                    include: {
                                        itemZone: {
                                            select: {
                                                zone: {
                                                    select: {
                                                        ze_id: true,
                                                        ze_name: true,
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
        let result = transformKeys(preset, keyMap);
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

export async function getAllPresets(req: Request, res: Response) {
    try {
        const latest = req.query.latest === "true";
        const presets = await prisma.preset.findMany({
            where: latest ? { ps_latest: latest } : undefined,
            select: {
                ps_id: true,
                ps_title: true,
                ps_description: true,
                presetChecklist: {
                    select: {
                        checklist: {
                            select: {
                                cl_id: true,
                                cl_title: true,
                                item: {
                                    include: {
                                        itemZone: {
                                            select: {
                                                zone: {
                                                    select: {
                                                        ze_id: true,
                                                        ze_name: true,
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

        let result = presets.map((preset: any) => transformKeys(preset, keyMap));
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}