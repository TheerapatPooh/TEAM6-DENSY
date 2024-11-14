import { prisma } from '../Utils/database'
import { Request, Response } from 'express'

export async function getPreset(req: Request, res: Response) {
    try {
        const presetId = parseInt(req.params.id, 10)
        const preset = await prisma.preset.findUnique({
            where: { ps_id: presetId },
            include: {
                user: {
                    include: {
                        profile: {
                            include: {
                                pf_image: true
                            }
                        }
                    }
                },
                checklist: {
                    include: {
                        checklist: {
                            include: {
                                user: {
                                    include: {
                                        profile: {
                                            include: {
                                                pf_image: true
                                            }
                                        }
                                    }
                                },
                                item: {
                                    include: {
                                        item_zone: {
                                            include: {
                                                zone: true
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
        }
        const result = {
            id: preset.ps_id,
            title: preset.ps_title,
            description: preset.ps_description,
            version: preset.ps_version,
            latest: preset.ps_latest,
            updatedAt: preset.ps_update_at.toISOString(),
            updateBy: {
                id: preset.user.us_id,
                name: preset.user.profile?.pf_name,
                age: preset.user.profile?.pf_age,
                tel: preset.user.profile?.pf_tel,
                address: preset.user.profile?.pf_address,
                imagePath: preset.user.profile?.pf_image?.im_path ?? null 
            },
            checklist: preset.checklist.map((cl: any) => ({
                id: cl.pscl_cl_id,
                title: cl.checklist.cl_title,
                version: cl.checklist.cl_version,
                latest: cl.checklist.cl_latest,
                updatedAt: cl.checklist.cl_update_at.toISOString(),
                updateBy: {
                    id: cl.checklist.user.us_id,
                    name: cl.checklist.user.profile?.pf_name,
                    age: cl.checklist.user.profile?.pf_age,
                    tel: cl.checklist.user.profile?.pf_tel,
                    address: cl.checklist.user.profile?.pf_address,
                    imagePath: cl.checklist.user.profile?.pf_image?.im_path ?? null 
                },
                items: cl.checklist.item.map((item: any) => ({
                    id: item.it_id,
                    name: item.it_name,
                    type: item.it_type,
                    zones: item.item_zone.map((zone: any) => ({
                        id: zone.zone.ze_id,
                        name: zone.zone.ze_name,
                    }))
                }))
            }))
        }
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
                user: {
                    include: {
                        profile: {
                            include: {
                                pf_image: true
                            }
                        }
                    }
                },
                checklist: {
                    include: {
                        checklist: {
                            include: {
                                user: {
                                    include: {
                                        profile: {
                                            include: {
                                                pf_image: true
                                            }
                                        }
                                    }
                                },
                                item: {
                                    include: {
                                        item_zone: {
                                            include: {
                                                zone: true
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
        }

        const result = presets.map((preset: any) => ({
            id: preset.ps_id,
            title: preset.ps_title,
            description: preset.ps_description,
            version: preset.ps_version,
            latest: preset.ps_latest,
            updatedAt: preset.ps_update_at.toISOString(),
            updateBy: {
                id: preset.user.us_id,
                name: preset.user.profile[0]?.pf_name,
                age: preset.user.profile[0]?.pf_age,
                tel: preset.user.profile[0]?.pf_tel,
                address: preset.user.profile[0]?.pf_address,
                imagePath: preset.user.profile[0]?.pf_image?.im_path ?? null 
            },
            checklist: preset.checklist.map((cl: any) => ({
                id: cl.pscl_cl_id,
                title: cl.checklist.cl_title,
                version: cl.checklist.cl_version,
                latest: cl.checklist.cl_latest,
                updatedAt: cl.checklist.cl_update_at.toISOString(),
                updateBy: {
                    id: cl.checklist.user.us_id,
                    name: cl.checklist.user.profile[0]?.pf_name,
                    age: cl.checklist.user.profile[0]?.pf_age,
                    tel: cl.checklist.user.profile[0]?.pf_tel,
                    address: cl.checklist.user.profile[0]?.pf_address,
                    imagePath: cl.checklist.user.profile[0]?.pf_image?.im_path ?? null 
                },
                items: cl.checklist.item.map((item: any) => ({
                    id: item.it_id,
                    name: item.it_name,
                    type: item.it_type,
                    zones: item.item_zone.map((zone: any) => ({
                        id: zone.zone.ze_id,
                        name: zone.zone.ze_name,
                    }))
                }))
            }))
        }))

        res.status(200).json(result)
    } catch (err) {
        res.status(500)
    }
}