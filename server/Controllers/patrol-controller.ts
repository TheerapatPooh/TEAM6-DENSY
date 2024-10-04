import { prisma } from "../Utils/database";
import { Request, Response } from "express";

export async function getPatrol(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const id = parseInt(req.params.id, 10);
    const patrol = await prisma.patrol.findUnique({
      where: { id },
      include: {
        preset: {
          include: {
            checklist: {
              include: {
                checklist: {
                  include: {
                    item: true,
                  },
                },
              },
            },
          },
        },
        checklist: {
          include: {
            inspector: {
              include: {
                profile: true,
              },
            },
          },
        },
        user: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!patrol) {
      return res.status(404).send("Patrol not found");
    }

    const isUserInPatrol = patrol.user.some(
      (userPatrol) => userPatrol.users_id === userId
    );
    if (!isUserInPatrol && user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const patrolDetail = {
      id: patrol.id,
      date: patrol.date,
      start_time: patrol.start_time,
      end_time: patrol.end_time,
      duration: patrol.duration,
      status: patrol.status,
      preset: {
        id: patrol.preset.id,
        title: patrol.preset.title,
        description: patrol.preset.description,
        version: patrol.preset.version,
        lasted: patrol.preset.lasted,
        updateAt: patrol.preset.updateAt,
        updateBy: patrol.preset.updateBy,

        checklists: patrol.preset.checklist.map(
          (checklist: any, index: number) => ({
            id: checklist.checklists_id,
            title: checklist.checklist.title,
            version: checklist.checklist.version,
            lasted: checklist.checklist.lasted,
            updateAt: checklist.checklist.updateAt,
            updateBy: checklist.checklist.updateBy,
            inspector: patrol.checklist[index].inspector.profile,
            items: checklist.checklist.item.map((item: any) => ({
              id: item.id,
              name: item.name,
              type: item.type,
              zones_id: item.zones_id,
            })),
          })
        ),
      },
    };
    res.send(patrolDetail);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function getAllPatrols(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "INSPECTOR") {
      const inspectorPatrols = await prisma.patrol.findMany({
        where: {
          checklist: {
            some: {
              inspectorId: userId,
            },
          },
        },
        include: {
          user: {
            include: {
              user: true,
            },
          },
          preset: true,
          checklist: {
            include: {
              inspector: true,
              checklist: true,
            },
          },
        },
      });

      if (inspectorPatrols.length > 0) {
        return res.json(inspectorPatrols);
      } else {
        return res.status(404).json({ message: "No patrols found for you" });
      }
    } else if (user.role === "ADMIN") {
      const allPatrols = await prisma.patrol.findMany({
        include: {
          preset: true,
          checklist: {
            include: {
              inspector: true,
              checklist: true,
            },
          },
        },
      });

      return res.json(allPatrols);
    } else {
      return res.status(403).json({ message: "Access Denied" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}
export async function createPatrol(req: Request, res: Response) {
    try {
      const { date, presets_id, patrol_has_Checklist } = req.body;
  
      // Check for required fields
      if (
        !date ||
        !presets_id ||
        !patrol_has_Checklist ||
        !Array.isArray(patrol_has_Checklist)
      ) {
        return res.status(400).json({
          error: "Missing required fields or patrol_has_Checklist is not an array",
        });
      }
  
      // Create a new patrol record
      const newPatrol = await prisma.patrol.create({
        data: {
          date: new Date(date),
          status: "Pending",
          presets_id: parseInt(presets_id, 10),
        },
      });
  
      // Remove duplicates from patrol_has_Checklist
      const uniquePatrolHasChecklist = [];
      const seen = new Set();
      
      for (const item of patrol_has_Checklist) {
        const identifier = `${item.checklistId}-${item.inspectorId}`; // Create a unique identifier
  
        // Check if the identifier has already been seen
        if (!seen.has(identifier)) {
          seen.add(identifier); // Add to the set to track unique combinations
          uniquePatrolHasChecklist.push(item); // Add the item to the unique array
        }
      }
  
      // Create patrol_has_Checklist data
      const patrol_has_Checklist_data = uniquePatrolHasChecklist.map(
        ({ checklistId, inspectorId }) => ({
          patrolId: newPatrol.id,
          checklistId: checklistId,
          inspectorId: inspectorId,
        })
      );
  
      // Create user_has_patrols data with unique user IDs
      const userIds = new Set();
      const user_has_patrols_data = uniquePatrolHasChecklist.reduce((acc, { inspectorId }) => {
        if (!userIds.has(inspectorId)) {
          userIds.add(inspectorId); // Add to the set to ensure uniqueness
          acc.push({
            users_id: inspectorId,
            patrols_id: newPatrol.id,
          });
        }
        return acc; // Return the accumulated array
      }, [] as { users_id: any; patrols_id: number }[]); // Specify the type for the accumulator
  
      // Insert patrol_has_Checklist entries
      await prisma.patrol_Has_Checklist.createMany({
        data: patrol_has_Checklist_data,
      });
  
      // Insert unique user_has_patrol entries
      await prisma.user_Has_Patrol.createMany({
        data: user_has_patrols_data,
      });
  
      res.status(201).json(newPatrol);
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).send({ error: "Internal server error" });
    }
  }
  
  