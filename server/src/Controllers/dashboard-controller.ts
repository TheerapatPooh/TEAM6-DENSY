import prisma from "@Utils/database.js";
import { Request, Response } from "express";

export async function getHeatMap(req: Request, res: Response) {
    try {
        const { startDate, endDate } = req.query;
        // สร้างตัวกรองสำหรับวันที่ ถ้ามี startDate และ endDate
        const dateFilter: any = {};
        if (startDate || endDate) {
            dateFilter.startTime = {
                ...(startDate && { gte: new Date(startDate as string) }),
                ...(endDate && { lte: new Date(endDate as string) }),
            };
        }
        const allZones = await prisma.zone.findMany({
            include: {
                itemZones: {
                    include: {
                        results: {
                            select: {
                                defects: {
                                    where: dateFilter,
                                }
                            },
                        },
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
            let defectCount = 0;

            // วนลูปผ่านทุกๆ itemZone ของ zone
            zone.itemZones.forEach(itemZone => {
                itemZone.results.forEach(result => {
                    defectCount += result.defects.length; // เพิ่มจำนวน defects ที่ตรงเงื่อนไข
                });
            });

            // คืนค่าข้อมูลที่มี id, name และ defects
            return {
                id: zone.id,
                name: zone.name,
                defects: defectCount,
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
        const { startDate, endDate } = req.query;

        // สร้างตัวกรองสำหรับวันที่ ถ้ามี startDate และ endDate
        const dateFilter: any = {};
        if (startDate || endDate) {
            dateFilter.startTime = {
                ...(startDate && { gte: new Date(startDate as string) }),
                ...(endDate && { lte: new Date(endDate as string) }),
            };
        }
        const allDefects = await prisma.defect.findMany({
            where: dateFilter,
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

        // คำนวณ trend
        const currentMonthStart = startDate ? new Date(startDate as string) : new Date();
        currentMonthStart.setDate(1);
        currentMonthStart.setHours(0, 0, 0, 0);

        const currentMonthEnd = new Date(currentMonthStart);
        currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
        currentMonthEnd.setMilliseconds(-1);

        const previousMonthStart = new Date(currentMonthStart);
        previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);

        const previousMonthEnd = new Date(currentMonthStart);
        previousMonthEnd.setMilliseconds(-1);

        // ดึง defect ของเดือนปัจจุบันและเดือนก่อนหน้า
        const defectsCurrentMonth = await prisma.defect.count({
            where: {
                startTime: {
                    gte: currentMonthStart,
                    lte: currentMonthEnd,
                },

            },
        });

        const defectsPreviousMonth = await prisma.defect.count({
            where: {
                startTime: {
                    gte: previousMonthStart,
                    lte: previousMonthEnd,
                },
            },
        });

        let trend = 0;
        if (defectsPreviousMonth > 0) {
            trend = ((defectsCurrentMonth - defectsPreviousMonth) / defectsPreviousMonth) * 100;
        } else if (defectsCurrentMonth > 0) {
            trend = 100;
        }

        let result = {
            chartData: defectCatagory,
            trend: trend,
        }
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
        const { startDate, endDate } = req.query;
        // สร้างตัวกรองสำหรับวันที่ ถ้ามี startDate และ endDate
        const dateFilter: any = {};
        if (startDate || endDate) {
            dateFilter.startTime = {
                ...(startDate && { gte: new Date(startDate as string) }),
                ...(endDate && { lte: new Date(endDate as string) }),
            };
        }
        const allDefects = await prisma.defect.findMany({
            where: dateFilter,
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
        const { startDate, endDate } = req.query;
        // สร้างตัวกรองสำหรับวันที่ ถ้ามี startDate และ endDate
        const dateFilter: any = {};
        if (startDate || endDate) {
            dateFilter.date = {
                ...(startDate && { gte: new Date(startDate as string) }),
                ...(endDate && { lte: new Date(endDate as string) }),
            };
        }
        const allPatrols = await prisma.patrol.findMany({
            where: dateFilter,
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


        // คำนวณ trend
        const currentMonthStart = startDate ? new Date(startDate as string) : new Date();
        currentMonthStart.setDate(1);
        currentMonthStart.setHours(0, 0, 0, 0);

        const currentMonthEnd = new Date(currentMonthStart);
        currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
        currentMonthEnd.setMilliseconds(-1);

        const previousMonthStart = new Date(currentMonthStart);
        previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);

        const previousMonthEnd = new Date(currentMonthStart);
        previousMonthEnd.setMilliseconds(-1);

        const patrolsCurrentMonth = await prisma.patrol.findMany({
            where: {
                date: {
                    gte: currentMonthStart,
                    lte: currentMonthEnd,
                },
            },
            include: {
                results: {
                    select: {
                        defects: true,
                    },
                },
            },
        });

        const currentCompletionRate = {
            noDefect: 0,
            withDefect: 0,
        };

        patrolsCurrentMonth.forEach((patrol) => {
            // ตรวจสอบว่า patrol นี้มี defects หรือไม่
            const hasDefects = patrol.results.some(
                (result) => result.defects.length > 0
            );

            if (hasDefects) {
                currentCompletionRate.withDefect += 1;
            } else {
                currentCompletionRate.noDefect += 1;
            }
        });

        const patrolsPreviousMonth = await prisma.patrol.findMany({
            where: {
                date: {
                    gte: previousMonthStart,
                    lte: previousMonthEnd,
                },
            },
            include: {
                results: {
                    select: {
                        defects: true,
                    },
                },
            },
        });

        const prevCompletionRate = {
            noDefect: 0,
            withDefect: 0,
        };

        patrolsPreviousMonth.forEach((patrol) => {
            // ตรวจสอบว่า patrol นี้มี defects หรือไม่
            const hasDefects = patrol.results.some(
                (result) => result.defects.length > 0
            );

            if (hasDefects) {
                prevCompletionRate.withDefect += 1;
            } else {
                prevCompletionRate.noDefect += 1;
            }
        });

        const currentPercent = (currentCompletionRate.noDefect / patrolsCurrentMonth.length) * 100;
        const prevPercent = (prevCompletionRate.noDefect / patrolsPreviousMonth.length) * 100;
        let trend = 0;
        if (prevPercent > 0) {
            trend = ((currentPercent - prevPercent) / prevPercent) * 100;
        } else if (currentPercent > 0) {
            trend = 100;
        }

        // สร้างข้อมูลสำหรับแสดงผลใน radial chart
        const patrolCompletionRate = [
            {
                noDefect: completionRate.noDefect,
                withDefect: completionRate.withDefect
            },
        ];

        let result = {
            chartData: allPatrols.length !== 0 ? patrolCompletionRate : [],
            percent: currentPercent,
            trend: trend,
        }
        res.status(200).json(result);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal server error: ${error}` });
        return;
    }
}

