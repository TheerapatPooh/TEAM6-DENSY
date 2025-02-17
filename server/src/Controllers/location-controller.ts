import prisma from "@Utils/database.js";
import { Request, Response } from "express";
import { calculateTrend, createNotification } from "@Controllers/util-controller.js";
import { DefectStatus, ItemType, NotificationType } from "@prisma/client";

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล Zone
 * Input:
 * - req.params.id: Int (ID ของ Zone)
 * Output: JSON object ข้อมูล Zone
 **/
export async function getZone(req: Request, res: Response) {
  try {
    const { dashboard, startDate, endDate, status, type, search } = req.query;
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

    // สร้างเงื่อนไขหลัก
    const whereConditions: any = {
      startTime: dateFilter
    };

    const andConditions: any[] = [];

    // เงื่อนไขการกรองตาม status
    if (status) {
      andConditions.push({ status: status });
    }

    // เงื่อนไขการกรองตาม type
    if (type) {
      const typeArray = (type as string).split(","); // แยกค่าด้วย comma
      const orTypeConditions = typeArray.map((t) => ({ type: t })); // สร้าง array ของ OR เงื่อนไข

      andConditions.push({ OR: orTypeConditions });
    }

    function mapSearchToStatus(search: string): DefectStatus | null {
      const searchLower = search.toLowerCase();

      // ตรวจสอบความใกล้เคียงกับค่าของ DefectStatus
      if (searchLower.startsWith("rep")) {
        return DefectStatus.reported;
      } else if (searchLower.startsWith("in")) {
        return DefectStatus.in_progress;
      } else if (searchLower.startsWith("pe")) {
        return DefectStatus.pending_inspection;
      } else if (searchLower.startsWith("res")) {
        return DefectStatus.resolved;
      } else if (searchLower.startsWith("co")) {
        return DefectStatus.completed;
      }
      // ถ้าไม่มีค่าใดที่ตรงกับการค้นหา
      return null;
    }

    function mapSearchToType(search: string): ItemType | null {
      const searchLower = search.toLowerCase();

      // ตรวจสอบความใกล้เคียงกับค่าของ DefectStatus
      if (searchLower.startsWith("sa")) {
        return ItemType.safety;
      } else if (searchLower.startsWith("en")) {
        return ItemType.environment;
      } else if (searchLower.startsWith("ma")) {
        return ItemType.maintenance;
      }

      // ถ้าไม่มีค่าใดที่ตรงกับการค้นหา
      return null;
    }

    // เงื่อนไขการค้นหา (search)
    if (search) {
      const searchId = parseInt(search as string, 10);



      const mappedStatus = mapSearchToStatus(search as string);
      const mappedTypes = mapSearchToType(search as string);

      const orConditions = [];

      if (!isNaN(searchId)) {
        orConditions.push({ id: searchId });
      }

      // ถ้า mappedStatus มีค่า (ค้นหาตรงกับสถานะ)
      if (mappedStatus) {
        orConditions.push({ status: mappedStatus as DefectStatus });
      }

      // ถ้า mappedTypes มีค่า (ค้นหาตรงกับชนิด)
      if (mappedTypes) {
        orConditions.push({ type: mappedTypes as ItemType });
      }

      orConditions.push({
        name: {
          contains: search as string,
        },
      });

      orConditions.push({
        user: {
          profile: {
            name: {
              contains: search as string,
            },
          },
        },
      });

      // ถ้ามีเงื่อนไขใน OR ให้เพิ่มเข้าไปใน AND
      if (orConditions.length > 0) {
        andConditions.push({ OR: orConditions });
      }
    }

    // ถ้ามีเงื่อนไขเพิ่มเติมให้เพิ่มเข้าไปใน AND
    if (andConditions.length > 0) {
      whereConditions.AND = andConditions;
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
                  },
                  include: {
                    user: {
                      select: {
                        id: true,
                        profile: true
                      }
                    }
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

    const allData = await prisma.zone.findUnique({
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
                defects: true,
                comments: true
              }
            }
          }
        }
      },
    })

    if (!zoneWithData || !allData) {
      return res.status(404).json({
        message: "Zone not found"
      })
    }

    let defectReported = 0
    let defectCompleted = 0
    let defectPending = 0
    let monthlyDefects: { [key: string]: number } = {};
    let allDefects: any[] = [];

    for (const itemZone of zoneWithData.itemZones) {
      for (const result of itemZone.results) {
        defectReported += result.defects?.length || 0
        for (const defect of result.defects) {
          allDefects.push(defect);
          if (defect.status === "completed") {
            defectCompleted++;
          } else {
            defectPending++;
          }
        }
      }
    }

    for (const itemZone of allData.itemZones) {
      for (const result of itemZone.results) {
        for (const defect of result.defects) {
          const defectDate = new Date(defect.startTime);
          const defectMonth = defectDate.toLocaleString("en-US", { month: "long" });
          const defectYear = defectDate.getFullYear(); // ดึงปี
          const monthYearKey = `${defectMonth} ${defectYear}`; // รวมเดือนและปี
          monthlyDefects[monthYearKey] = (monthlyDefects[monthYearKey] || 0) + 1;
        }
      }
    }

    // กรองตาม status
    if (status) {
      allDefects = allDefects.filter(defect => defect.status === status);
    }

    // กรองตาม type (รองรับหลายค่า)
    if (type) {
      const types = (type as string).split(',');
      allDefects = allDefects.filter(defect => types.includes(defect.type));
    }

    // กรองตาม search (รองรับหลายเงื่อนไข)
    if (search) {
      const searchId = parseInt(search as string, 10);
      const mappedStatus = mapSearchToStatus(search as string);
      const mappedType = mapSearchToType(search as string);

      allDefects = allDefects.filter(defect => {
        const searchLower = search.toString().toLocaleLowerCase();
        const matchesId = defect.id === searchId;
        const matchesStatus = mappedStatus ? defect.status === mappedStatus : false;
        const matchesType = mappedType ? defect.type === mappedType : false;
        const matchesName = defect.name?.toLowerCase().includes(searchLower);
        const matchesUserName = defect.user?.profile?.name?.toLowerCase().includes(searchLower);

        return matchesId || matchesStatus || matchesType || matchesName || matchesUserName;
      });
    }

    // แปลง `endDate` เป็น Date Object
    const endDateObj = endDate ? new Date(endDate as string) : null;
    const endYear = endDateObj ? endDateObj.getFullYear() : null;
    const endMonth = endDateObj ? endDateObj.getMonth() : null;

    // สร้าง `chartData` และกรองข้อมูลตาม `endDate`
    const chartData = Object.keys(monthlyDefects)
      .map((monthYear) => {
        const [monthName, year] = monthYear.split(" ");
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth(); // แปลงชื่อเดือนเป็น index

        return {
          month: monthYear,
          defect: monthlyDefects[monthYear],
          year: parseInt(year),
          monthIndex,
        };
      })
      .filter((data) => {
        // ถ้ามี `endDate` ให้กรองเฉพาะข้อมูลที่อยู่ก่อนหรือเท่ากับ `endDate`
        if (endDateObj && endYear !== null && endMonth !== null) {
          return data.year < endYear || (data.year === endYear && data.monthIndex <= endMonth);
        }
        return true;
      })
      .map(({ month, defect }) => ({ month, defect })); // คืนค่าเฉพาะฟิลด์ที่ต้องการ


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

    let currentDefects = 0
    let currentCompleted = 0
    let currentPending = 0

    let prevDefects = 0
    let prevCompleted = 0
    let prevPending = 0

    for (const itemZone of currentMonthData.itemZones) {
      for (const result of itemZone.results) {
        currentDefects += result.defects?.length || 0
        for (const defect of result.defects) {
          defect.status === 'completed'
            ? currentCompleted++
            : currentPending++
        }
      }
    }

    for (const itemZone of previousMonthData.itemZones) {
      for (const result of itemZone.results) {
        prevDefects += result.defects?.length || 0
        for (const defect of result.defects) {
          defect.status === 'completed'
            ? prevCompleted++
            : prevPending++
        }
      }
    }

    const result = {
      ...zoneWithoutItemZones,
      dashboard: {
        defectReported: { value: defectReported, trend: calculateTrend(currentDefects, prevDefects) },
        defectCompleted: { value: defectCompleted, trend: calculateTrend(currentCompleted, prevCompleted) },
        defectPending: { value: defectPending, trend: calculateTrend(currentPending, prevPending) },
        chartData,
        defectTrend: calculateTrend(currentDefects, prevDefects),
        defects: allDefects
      }
    }

    return res.status(200).json(result)

  } catch (error) {
    console.error("Server Error:", error)
    return res.status(500).json("Internal server error")
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
