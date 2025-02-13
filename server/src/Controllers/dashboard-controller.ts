import prisma from "@Utils/database.js";
import { Request, Response } from "express";

export async function getHeatMap(req: Request, res: Response) {
    try {
        const allZones = await prisma.zone.findMany({
            include: {
                itemZones: {
                    select: {
                        results: {
                            select: {
                                defects: true
                            },
                        }
                    },
                },
            },
        });

        if (!allZones) {
            res.status(404).json({ message: "Zones not found" });
            return;
        }

        // คำนวณ heatMap
        const heatMap = allZones.map(zone => {
            // นับจำนวน defects ในแต่ละ zone
            let defectCount = 0;

            // วนลูปผ่านทุกๆ itemZone ของ zone
            zone.itemZones.forEach(itemZone => {
                itemZone.results.forEach(result => {
                    defectCount += result.defects.length; // เพิ่มจำนวน defects ที่พบใน result
                });
            });

            // คืนค่าข้อมูลที่มี id, name และ defects
            return {
                id: zone.id,
                name: zone.name,
                defects: defectCount
            };
        });

        let result = heatMap;
        res.status(200).json(result);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal server error: ${error}` });
        return;
    }
}
export async function getDefectCatagory(req: Request, res: Response) {
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

        let defectCategoryMap: Record<
            string,
            { type: string; amounts: number; fill: string }
        > = {};
        allDefects.forEach((defect) => {
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
        let defectNameMap: Record<
            string,
            { name: string; amounts: number; fill: string }
        > = {};

        const usedColors = new Set<number>(); // เก็บค่าที่ใช้ไปแล้ว

        allDefects.forEach((defect) => {
            const name = defect.name || "Unknown Defect";
            if (!defectNameMap[name]) {
                let randomChartIndex;
                const availableIndices = [1, 2, 3, 4, 5].filter(
                    (i) => !usedColors.has(i)
                );

                if (availableIndices.length === 0) {
                    usedColors.clear(); // รีเซ็ตเมื่อครบ 5 สี
                    randomChartIndex = Math.floor(Math.random() * 5) + 1;
                } else {
                    randomChartIndex =
                        availableIndices[
                        Math.floor(Math.random() * availableIndices.length)
                        ];
                }

                usedColors.add(randomChartIndex);

                defectNameMap[name] = {
                    name,
                    amounts: 0,
                    fill: `hsl(var(--chart-${randomChartIndex}))`,
                };
            }
            defectNameMap[name].amounts++;
        });

        let result = defectCatagory
        res.status(200).json(result);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal server error: ${error}` });
        return;
    }
}
export async function getCommonDefects(req: Request, res: Response) {
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
                },
            },
        });

        if (!allDefects) {
            res.status(404).json({ message: "Defect not found" });
            return;
        }

        // คำนวณ commonDefects
        let defectNameMap: Record<
            string,
            { name: string; amounts: number; fill: string }
        > = {};

        const usedColors = new Set<number>(); // เก็บค่าที่ใช้ไปแล้ว

        allDefects.forEach((defect) => {
            const name = defect.name || "Unknown Defect";
            if (!defectNameMap[name]) {
                let randomChartIndex;
                const availableIndices = [1, 2, 3, 4, 5].filter(
                    (i) => !usedColors.has(i)
                );

                if (availableIndices.length === 0) {
                    usedColors.clear(); // รีเซ็ตเมื่อครบ 5 สี
                    randomChartIndex = Math.floor(Math.random() * 5) + 1;
                } else {
                    randomChartIndex =
                        availableIndices[
                        Math.floor(Math.random() * availableIndices.length)
                        ];
                }

                usedColors.add(randomChartIndex);

                defectNameMap[name] = {
                    name,
                    amounts: 0,
                    fill: `hsl(var(--chart-${randomChartIndex}))`,
                };
            }
            defectNameMap[name].amounts++;
        });

        // แปลงเป็นอาเรย์ + เรียงลำดับจากมากไปน้อย + เอาแค่ 5 ตัวแรก
        const commonDefects = Object.values(defectNameMap)
            .sort((a, b) => b.amounts - a.amounts) // เรียงจากมากไปน้อย
            .slice(0, 5); // เอาแค่ 5 อันแรก


        let result = commonDefects;
        res.status(200).json(result);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal server error: ${error}` });
        return;
    }
}
export async function getPatrolCompletionRate(req: Request, res: Response) {
    try {
        const allPatrols = await prisma.patrol.findMany({
            include: {
                results: {
                    select: {
                        defects: true,
                    },
                },
            },
        });
        if (!allPatrols) {
            res.status(404).json({ message: "Patrol not found" });
            return;
        }

        // คำนวณ patrolCompletionRate
        const completionRate = {
            noDefect: 0,
            withDefect: 0,
        };

        allPatrols.forEach((patrol) => {
            // ตรวจสอบว่า patrol นี้มี defects หรือไม่
            const hasDefects = patrol.results.some(
                (result) => result.defects.length > 0
            );

            if (hasDefects) {
                completionRate.withDefect += 1;
            } else {
                completionRate.noDefect += 1;
            }
        });

        // สร้างข้อมูลสำหรับแสดงผลใน radial chart
        const patrolCompletionRate = [
            {
                noDefect: completionRate.noDefect,
                withDefect: completionRate.withDefect
            },
        ];

        let result = patrolCompletionRate;
        res.status(200).json(result);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal server error: ${error}` });
        return;
    }
}

