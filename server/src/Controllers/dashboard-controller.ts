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
        // คำนวณ defectCategory
        const typeColorMap: Record<string, string> = {
            environment: "hsl(var(--primary))",
            safety: "hsl(var(--green))",
            maintenance: "hsl(var(--destructive))",
        };

        let defectCategoryMap: Record<string, { type: string; amounts: number; fill: string }> = {};
        allDefects.forEach(defect => {
            const type = defect.type || "Unknown";
            if (!defectCategoryMap[type]) {
                defectCategoryMap[type] = {
                    type,
                    amounts: 0,
                    fill: typeColorMap[type] || "hsl(var(--chart-1))",
                };
            }
            defectCategoryMap[type].amounts++;
        });

        const defectCatagory = Object.values(defectCategoryMap);

        // คำนวณ commonDefects
        let defectNameMap: Record<string, { name: string; amounts: number; fill: string }> = {};

        const usedColors = new Set<number>(); // เก็บค่าที่ใช้ไปแล้ว

        allDefects.forEach(defect => {
            const name = defect.name || "Unknown Defect";
            if (!defectNameMap[name]) {
                let randomChartIndex;
                const availableIndices = [1, 2, 3, 4, 5].filter(i => !usedColors.has(i));

                if (availableIndices.length === 0) {
                    usedColors.clear(); // รีเซ็ตเมื่อครบ 5 สี
                    randomChartIndex = Math.floor(Math.random() * 5) + 1;
                } else {
                    randomChartIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
                }

                usedColors.add(randomChartIndex);

                defectNameMap[name] = {
                    name,
                    amounts: 0,
                    fill: `hsl(var(--chart-${randomChartIndex}))`
                };
            }
            defectNameMap[name].amounts++;
        });

        // แปลงเป็นอาเรย์ + เรียงลำดับจากมากไปน้อย + เอาแค่ 5 ตัวแรก
        const commonDefects = Object.values(defectNameMap)
            .sort((a, b) => b.amounts - a.amounts) // เรียงจากมากไปน้อย
            .slice(0, 5); // เอาแค่ 5 อันแรก



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