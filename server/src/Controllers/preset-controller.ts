import { prisma } from '@Utils/database.js'
import { Request, Response } from 'express'
import transformKeys, { keyMap } from '@Utils/key-map.js'
import { Preset } from '@prisma/client'

export async function getPreset(req: Request, res: Response) {
    try {
        const presetId = parseInt(req.params.id, 10)
        const preset = await prisma.preset.findUnique({
            where: { ps_id: presetId },
            include: {
                checklist: {
                    include: {
                        checklist: {
                            include: {
                                user: {
                                    include: {
                                        profile: {
                                            include: {
                                                image: true
                                            }
                                        }
                                    }
                                },
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
    } catch (err) {
        res.status(500)
    }
}

export async function getAllPresets(req: Request, res: Response) {
    try {
        const presets = await prisma.preset.findMany({
            where: { ps_latest: true },
            include: {
                checklist: {
                    include: {
                        checklist: {
                            include: {
                                user: {
                                    include: {
                                        profile: {
                                            include: {
                                                image: true
                                            }
                                        }
                                    }
                                },
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

        let result = presets.map((preset: Preset) => transformKeys(preset, keyMap));
        res.status(200).json(result)
    } catch (err) {
        res.status(500)
    }
}