import prisma from "@Utils/database.js";
import { Request, Response } from "express";

export async function getHeatMap(req: Request, res: Response) {
    try {

        const allDefects = await prisma.defect.findMany({
            include: {
                supervisor: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
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
                                                profile: {
                                                    select: {
                                                        name: true,
                                                        image: true
                                                    }
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
        });

        if (!allDefects) {
            res.status(404).json({ message: "Defect not found" });
            return;
        }

        let defectCategoryMap: Record<string, { type: string; amounts: number; fill: string }> = {};
        allDefects.forEach(defect => {
            const type = defect.type || "Unknown";
            if (!defectCategoryMap[type]) {
                defectCategoryMap[type] = { type, amounts: 0, fill: `var(--color-${type.toLowerCase()})` };
            }
            defectCategoryMap[type].amounts++;
        });

        const defectCatagory = Object.values(defectCategoryMap);

        // คำนวณ commonDefects
        let defectNameMap: Record<string, { name: string; amounts: number; fill: string }> = {};
        allDefects.forEach(defect => {
            const name = defect.name || "Unknown Defect";
            if (!defectNameMap[name]) {
                defectNameMap[name] = { name, amounts: 0, fill: "var(--color-chart-1)" };
            }
            defectNameMap[name].amounts++;
        });

        const commonDefects = Object.values(defectNameMap).slice(0, 4);

        let result = {
            defectCatagory,
            commonDefects,
        };
        res.status(200).json(result);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal server error: ${error}` });
        return;
    }
}