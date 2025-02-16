import prisma from "@Utils/database.js";
import { Request, Response } from "express";
import { createNotification } from "@Controllers/util-controller.js";
import { NotificationType } from "@prisma/client";

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Zone
 * Input:
 * - req.params.id: Int (ID ของ Zone)
 * Output: JSON object ข้อมูล Zone
 **/
export async function getZone(req: Request, res: Response) {
  try {
    const { dashboard, startDate, endDate } = req.query;
    const zoneId = parseInt(req.params.id, 10)
    const role = (req as any).user.role

    // สร้างตัวกรองสำหรับวันที่ ถ้ามี startDate และ endDate
    let dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter = {
        ...(startDate && { gte: new Date(startDate as string) }),
        ...(endDate && { lte: new Date(endDate as string) }),
      };
    }

    // Authorization Check
    if (dashboard === "true" && role !== 'admin') {
      return res.status(403).json({
        message: `Access Denied: Requires admin privileges`
      })
    }

    if (!dashboard) {
      const zone = await prisma.zone.findUnique({
        where: { id: zoneId },
        include: {
          supervisor: {
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
              department: true,
              createdAt: true,
              profile: { include: { image: true } },
            },
          },
        },
      })

      if (!zone) {
        return res.status(404).json({
          message: "Zone not found"
        })
      }

      return res.status(200).json(zone)
    }

    const zoneWithData = await prisma.zone.findUnique({
      where: { id: zoneId },
      include: {
        supervisor: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            department: true,
            createdAt: true,
            profile: { include: { image: true } },
          },
        },
        itemZones: {
          include: {
            results: {
              include: {
                defects: {
                  where: {
                    startTime: dateFilter
                  }
                },
                comments: {
                  where: {
                    timestamp: dateFilter
                  }
                }
              }
            }
          }
        }
      },
    })

    if (!zoneWithData) {
      return res.status(404).json({
        message: "Zone not found"
      })
    }

    let totalComments = 0
    let defectCompleted = 0
    let defectPending = 0

    for (const itemZone of zoneWithData.itemZones) {
      for (const result of itemZone.results) {
        totalComments += result.comments?.length || 0

        for (const defect of result.defects) {
          defect.status === 'completed'
            ? defectCompleted++
            : defectPending++
        }
      }
    }

    const { itemZones, ...zoneWithoutItemZones } = zoneWithData

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

    const currentMonthData = await prisma.zone.findUnique({
      where: { id: zoneId },
      include: {
        supervisor: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            department: true,
            createdAt: true,
            profile: { include: { image: true } },
          },
        },
        itemZones: {
          include: {
            results: {
              include: {
                defects: {
                  where: {
                    startTime: {
                      gte: currentMonthStart,
                      lte: currentMonthEnd,
                    }
                  }
                },
                comments: {
                  where: {
                    timestamp: {
                      gte: currentMonthStart,
                      lte: currentMonthEnd,
                    }
                  }
                }
              }
            }
          }
        }
      },
    })
    const previousMonthData = await prisma.zone.findUnique({
      where: { id: zoneId },
      include: {
        supervisor: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            department: true,
            createdAt: true,
            profile: { include: { image: true } },
          },
        },
        itemZones: {
          include: {
            results: {
              include: {
                defects: {
                  where: {
                    startTime: {
                      gte: previousMonthStart,
                      lte: previousMonthEnd,
                    }
                  }
                },
                comments: {
                  where: {
                    timestamp: {
                      gte: previousMonthStart,
                      lte: previousMonthEnd,
                    }
                  }
                }
              }
            }
          }
        }
      },
    })

    if (!currentMonthData || !previousMonthData) {
      res.status(404).send('Not Found Data')
      return
    }

    let currentComments = 0
    let currentCompleted = 0
    let currentPending = 0
    let prevComments = 0
    let prevCompleted = 0
    let prevPending = 0

    for (const itemZone of currentMonthData.itemZones) {
      for (const result of itemZone.results) {
        currentComments += result.comments?.length || 0

        for (const defect of result.defects) {
          defect.status === 'completed'
            ? currentCompleted++
            : currentPending++
        }
      }
    }
    for (const itemZone of previousMonthData.itemZones) {
      for (const result of itemZone.results) {
        prevComments += result.comments?.length || 0

        for (const defect of result.defects) {
          defect.status === 'completed'
            ? prevCompleted++
            : prevPending++
        }
      }
    }

    const calculateTrend = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(2));
    };

    const result = {
      ...zoneWithoutItemZones,
      dashboard: {
        totalComments: { value: totalComments, trend: calculateTrend(currentComments, prevComments) },
        defectCompleted: { value: defectCompleted, trend: calculateTrend(currentCompleted, prevCompleted) },
        defectPending: { value: defectPending, trend: calculateTrend(currentPending, prevPending) },
      }
    }

    return res.status(200).json(result)

  } catch (error) {
    console.error("Server Error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล ZoneSs ทั้งหมด
 * Input: -
 * Output: JSON object ข้อมูล Zone
 **/
export async function getAllZones(req: Request, res: Response) {
  try {
    const zone = await prisma.zone.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    if (!zone) {
      res.status(404);
      return;
    }
    let result = zone;

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Location
 * Input:
 * - req.params.id: Int (ID ของ Location)
 * Output: JSON object ข้อมูล Location
 **/
export async function getLocation(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const location = await prisma.location.findUnique({
      where: { id: id },
      include: {
        zones: {
          include: {
            supervisor: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
                department: true,
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
    });

    if (!location) {
      res.status(404);
      return;
    }

    let result = location;

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับเปลี่ยน Supervisor
 * Input:
 * - req.params.id: number (ID ของ Zone ที่ต้องการเปลี่ยน Supervisor)
 * - req.body: { userId: number},
 * Output: JSON object ข้อมูล Zone หลังจาก update
 **/
export async function updateSupervisor(req: Request, res: Response) {
  try {
    const zoneId = parseInt(req.params.id, 10);
    const { userId } = req.body;

    const oldZone = await prisma.zone.findUnique({
      where: { userId: userId },
    });

    if (oldZone && oldZone.id !== zoneId) {
      await prisma.zone.update({
        where: { id: oldZone.id },
        data: { userId: null },
      });
    }

    // อัปเดต zone
    await prisma.zone.update({
      where: { id: zoneId },
      data: {
        userId: userId ? parseInt(userId, 10) : null,
      },
    });

    let result = await prisma.zone.findUnique({
      where: {
        id: zoneId,
      },
      include: {
        supervisor: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            department: true,
            createdAt: true,
            profile: {
              include: {
                image: true,
              },
            },
          },
        },
      },
    });

    const message = `update_supervisor-${result?.name}`;
    await createNotification({
      message: message,
      type: "information" as NotificationType,
      url: `/profile`,
      userId: userId,
    });

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}
