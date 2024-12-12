import {
  getDefect,
  getAllDefects,
  createDefect,
  updateDefect,
  deleteDefect,
} from "@Controllers/defect-controller.js";
import {
  DefectStatus,
  ItemType,
  Defect,
  Patrol,
  PatrolStatus,
} from "@prisma/client";
import { prismaMock } from "./mock";
import { Request, Response } from "express";

describe("getDefect", () => {
  const defect: Defect = {
    id: 1,
    name: "Floor Cleanliness Check",
    description: "TEST_DATA",
    type: "environment" as ItemType,
    status: "reported" as DefectStatus,
    timestamp: "2024-12-11T13:52:30.871Z" as unknown as Date,
    userId: 3,
    patrolResultId: 17,
  };

  const patrol: Patrol = {
    id: 8,
    date: "2024-12-10T17:00:00.000Z" as unknown as Date,
    startTime: "2024-12-11T13:51:56.866Z" as unknown as Date,
    endTime: null,
    duration: null,
    status: "on_going" as PatrolStatus,
    presetId: 1,
  };
  test("should retrieve defect successfully if user has valid role and patrol", async () => {
    // Mock the findUnique and findFirst responses
    prismaMock.defect.findUnique.mockResolvedValue(defect);
    prismaMock.patrol.findFirst.mockResolvedValue(patrol);

    const req = {
      params: { id: "1" }, // ID as string
      user: {
        role: "inspector", // User role is inspector
        userId: 3, // User ID is 3
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Call the controller
    await getDefect(req, res);

    // Check if findUnique was called with correct parameters
    expect(prismaMock.defect.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1, // `id` from the params, converted to a number
      },
    });

    // Check if findFirst was called to validate the patrol
    expect(prismaMock.patrol.findFirst).toHaveBeenCalledWith({
      where: {
        results: {
          some: {
            id: defect.patrolResultId,
          },
        },
        patrolChecklists: {
          some: {
            userId: 3, // User ID from the request
          },
        },
      },
    });

    // Check the response status and data
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(defect);
  });
  test("should return 403 if user has invalid role", async () => {
    const req = {
      params: { id: "1" },
      user: {
        role: "supervisor", // Invalid role
        userId: 4,
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Call the controller
    await getDefect(req, res);

    // Check if 403 status is returned due to invalid role
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access Denied: Admins or Inspectors only",
    });
  });
  test("should return 404 if defect not found", async () => {
    // Mock the findUnique and findFirst responses
    prismaMock.defect.findUnique.mockResolvedValue(null);
    prismaMock.patrol.findFirst.mockResolvedValue(patrol);

    const req = {
      params: { id: "111" }, // ID as string
      user: {
        role: "inspector", // User role is inspector
        userId: 3, // User ID is 3
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Call the controller
    await getDefect(req, res);

    // Check if 404 status is returned when defect is not found
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Defect not found" });
  });
  test("should return 404 if user is not associated with the patrol", async () => {
    // Mock findFirst to return null, meaning the user is not associated with the patrol
    prismaMock.defect.findUnique.mockResolvedValue(defect);
    prismaMock.patrol.findFirst.mockResolvedValue(null);

    const req = {
      params: { id: "1" },
      user: {
        role: "inspector",
        userId: 3,
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Call the controller
    await getDefect(req, res);

    // Check if 404 status is returned when the user is not associated with the patrol
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "You are not associated with this Patrol",
    });
  });
});
describe("getAllDefects", () => {
  const Defects = [
    {
      id: 2,
      name: "Floor Cleanliness Check",
      description: "TEST2",
      type: "environment" as ItemType,
      status: "reported" as DefectStatus,
      timestamp: new Date("2024-12-11T16:02:15.812Z"),
      userId: 3,
      patrolResultId: 18,
      patrolResult: {
        zoneId: 6,
      },
      user: {
        id: 3,
        role: "inspector",
        email: null,
        createdAt: new Date("2024-10-06T10:27:09.916Z"),
        profile: {
          id: 3,
          name: "Jame Smith",
          tel: "0987654321",
          image: {
            id: 1,
            path: "1728239317254-Scan_20220113 (2).png",
            timestamp: new Date("2024-10-10T01:15:14.000Z"),
            updatedBy: 8,
          },
        },
      },
      images: [
        {
          image: {
            id: 3,
            path: "1733932935798-TEST_IMG2.jpg",
            user: {
              id: 3,
              username: "jameSmith",
              email: null,
              password:
                "$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm",
              role: "inspector",
              department: null,
              createdAt: new Date("2024-10-06T10:27:09.916Z"),
              active: true,
            },
          },
        },
      ],
    },
    {
      id: 3,
      name: "Floor Cleanliness Check",
      description: "TEST3",
      type: "environment" as ItemType,
      status: "reported" as DefectStatus,
      timestamp: new Date("2024-12-11T16:03:41.478Z"),
      userId: 3,
      patrolResultId: 18,
      patrolResult: {
        zoneId: 6,
      },
      user: {
        id: 3,
        role: "inspector",
        email: null,
        createdAt: new Date("2024-10-06T10:27:09.916Z"),
        profile: {
          id: 3,
          name: "Jame Smith",
          tel: "0987654321",
          image: {
            id: 1,
            path: "1728239317254-Scan_20220113 (2).png",
            timestamp: new Date("2024-10-10T01:15:14.000Z"),
            updatedBy: 8,
          },
        },
      },
      images: [
        {
          image: {
            id: 4,
            path: "1733933021474-TEST_IMG3.jpg",
            user: {
              id: 3,
              username: "jameSmith",
              email: null,
              password:
                "$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm",
              role: "inspector",
              department: null,
              createdAt: new Date("2024-10-06T10:27:09.916Z"),
              active: true,
            },
          },
        },
      ],
    },
  ];
  test("should retrieve all defect successfully if user has valid role and patrol", async () => {
    // Mock the findMany response
    prismaMock.defect.findMany.mockResolvedValue(Defects);

    const req = {
      params: { id: "1" }, // ID as string
      user: {
        role: "supervisor", // User role is inspector
        userId: 3, // User ID is 3
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Call the controller
    await getAllDefects(req, res);

    // Check if findMany was called with correct parameters
    expect(prismaMock.defect.findMany).toHaveBeenCalledWith({
      where: {
        patrolResult: {
          itemZone: {
            zone: {
              supervisor: {
                id: 3,
              },
            },
          },
        },
      },
      include: {
        patrolResult: {
          select: {
            zoneId: true,
          },
        },
        user: {
          select: {
            id: true,
            role: true,
            email: true,
            createdAt: true,
            profile: {
              select: {
                id: true,
                name: true,
                tel: true,
                image: true,
              },
            },
          },
        },
        images: {
          select: {
            image: {
              select: {
                id: true,
                path: true,
                user: true,
              },
            },
          },
        },
      },
    });

    // Check the response status and data
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(Defects); // Ensure the correct defects data is returned
  });
});
describe("createDefect", () => {
  test("should create a defect successfully if user has valid role and patrol", async () => {
    // Mock the prisma responses
    const mockPatrol: any = {
      id: 1,
      results: [{ id: 18 }],
      patrolChecklists: [{ userId: 3 }],
    };
    const mockDefect: any = {
      id: 1,
      name: "Floor Cleanliness Check",
      description: "TEST",
      type: "environment",
      status: "reported",
    };
    const mockImage: any = { id: 1, path: "image.jpg" };

    // Mock the Prisma findFirst and create functions
    prismaMock.patrol.findFirst.mockResolvedValue(mockPatrol);
    prismaMock.defect.create.mockResolvedValue(mockDefect);
    prismaMock.image.create.mockResolvedValue(mockImage);
    prismaMock.defectImage.create.mockResolvedValue({
      defectId: 1,
      imageId: 1,
    }); // Mock creating the defect-image relation

    // Create mock request and response objects
    const req = {
      body: {
        name: "Floor Cleanliness Check",
        description: "TEST",
        type: "environment",
        status: "reported",
        defectUserId: "3",
        patrolResultId: "18",
        supervisorId: "1",
      },
      files: [{ filename: "image.jpg" }],
      user: {
        role: "inspector", // Valid role
        userId: "3", // Valid userId
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Call the controller function
    await createDefect(req, res);

    // Check if the required Prisma methods were called
    expect(prismaMock.patrol.findFirst).toHaveBeenCalledWith({
      where: {
        results: {
          some: {
            id: 18,
          },
        },
        patrolChecklists: {
          some: {
            userId: 3,
          },
        },
      },
    });
    expect(prismaMock.defect.create).toHaveBeenCalledWith({
      data: {
        name: "Floor Cleanliness Check",
        description: "TEST",
        type: "environment",
        status: "reported",
        user: { connect: { id: 3 } },
        patrolResult: { connect: { id: 18 } },
      },
    });

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockDefect);
  });
});
describe("updateDefect", () => {
  test("should update a defect successfully if user has valid role and is associated with the patrol", async () => {
    const mockPatrol: any = {
      id: 1,
      results: [{ id: 18 }],
      patrolChecklists: [{ userId: 3 }],
    };
    const mockDefect: any = {
      id: 1,
      name: "Updated Name",
      description: "TEST",
      type: "environment",
      status: "reported",
      patrolResultId: 18,
      defectUserId: 3,
    };

    // Mock Prisma responses
    prismaMock.patrol.findFirst.mockResolvedValue(mockPatrol);
    prismaMock.defect.findUnique.mockResolvedValue(mockDefect);
    prismaMock.defect.update.mockResolvedValue(mockDefect); // Ensure this mock is set up correctly

    // Mock request and response objects
    const req = {
      params: { id: "1" }, // Ensure the ID matches
      body: {
        name: "Updated Name",
        description: "TEST",
        type: "environment",
        status: "reported",
        defectUserId: "3",
        patrolResultId: "18",
      },
      user: {
        role: "inspector", // Valid role
        userId: "3", // Valid userId
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Call the controller function
    await updateDefect(req, res);

    // Ensure the update method was called with correct parameters
    expect(prismaMock.defect.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: "Updated Name",
        description: "TEST",
        type: "environment",
        status: "reported",
        user: { connect: { id: 3 } },
        patrolResult: { connect: { id: 18 } },
      },
    });

    // Check if the response was sent
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Defect updated successfully",
      defect: mockDefect,
    });
  });
});
describe("deleteDefect", () => {
  const defect: Defect = {
    id: 1,
    name: "Floor Cleanliness Check",
    description: "TEST_DATA",
    type: "environment" as ItemType,
    status: "reported" as DefectStatus,
    timestamp: "2024-12-11T13:52:30.871Z" as unknown as Date,
    userId: 3,
    patrolResultId: 17,
  };

  const patrol: Patrol = {
    id: 8,
    date: "2024-12-10T17:00:00.000Z" as unknown as Date,
    startTime: "2024-12-11T13:51:56.866Z" as unknown as Date,
    endTime: null,
    duration: null,
    status: "on_going" as PatrolStatus,
    presetId: 1,
  };
  test("should delete defect successfully if user has valid role and patrol", async () => {
    prismaMock.defect.findUnique.mockResolvedValue(defect);
    prismaMock.patrol.findFirst.mockResolvedValue(patrol);
    prismaMock.defect.delete.mockResolvedValue(defect);
    prismaMock.defectImage.findMany.mockResolvedValue([]);
    prismaMock.image.findMany.mockResolvedValue([]);
    prismaMock.defectImage.deleteMany.mockResolvedValue({
      count: 0
    });
    prismaMock.image.deleteMany.mockResolvedValue({
      count: 0
    });

    const req = {
      params: { id: "1" }, // ID as string
      user: {
        role: "inspector", // User role is inspector
        userId: 3, // User ID is 3
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Call the controller
    await deleteDefect(req, res);

    // Check if findUnique was called with correct parameters
    expect(prismaMock.defect.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1, // `id` from the params, converted to a number
      },
    });

    // Check if findFirst was called to validate the patrol
    expect(prismaMock.patrol.findFirst).toHaveBeenCalledWith({
      where: {
        results: {
          some: {
            id: defect.patrolResultId,
          },
        },
        patrolChecklists: {
          some: {
            userId: 3, // User ID from the request
          },
        },
      },
    });
    expect(prismaMock.defect.delete).toHaveBeenCalledWith({
      where: {
        id: 1, // `id` from the params, converted to a number
      },
    });

    // Check the response status and data

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Defect deleted successfully",
    });
  });
});
