// patrol-controller.test.ts

import { getPatrol } from '@Controllers/patrol-controller.js';
import { PatrolStatus } from '@prisma/client';
import { prismaMock } from './mock';
import { Request, Response } from 'express';

describe('getPatrol', () => {
    const patrol = {
        id: 3,
        date: new Date("2024-12-09T17:00:00.000Z"),
        startTime: new Date("2024-12-10T15:42:33.129Z"),
        endTime: new Date("2024-12-10T15:44:16.784Z"),
        duration: "0h 1m 43s",
        status: "completed" as PatrolStatus,
        presetId: 1,
        patrolChecklists: [
            {
                id: 5,
                patrolId: 3,
                checklistId: 3,
                userId: 3,
                checklist: {
                    id: 3,
                    title: "Cleanliness Inspection",
                    items: [
                        {
                            id: 8,
                            name: "Floor Cleanliness Check",
                            type: "environment",
                            checklistId: 3,
                            itemZones: [
                                {
                                    zone: {
                                        id: 4,
                                        name: "quality_control_zone",
                                        supervisor: {
                                            id: 6,
                                            profile: {
                                                name: "David Wilson"
                                            }
                                        }
                                    }
                                },
                                {
                                    zone: {
                                        id: 6,
                                        name: "customer_service_zone",
                                        supervisor: {
                                            id: 8,
                                            profile: {
                                                name: "Jack Danial"
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            id: 9,
                            name: "Trash Disposal Check",
                            type: "environment",
                            checklistId: 3,
                            itemZones: [
                                {
                                    zone: {
                                        id: 6,
                                        name: "customer_service_zone",
                                        supervisor: {
                                            id: 8,
                                            profile: {
                                                name: "Jack Danial"
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    username: "jameSmith",
                    email: null,
                    password: "$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm",
                    role: "inspector",
                    department: null,
                    createdAt: new Date("2024-10-06T10:27:09.916Z"),
                    active: true,
                    profile: {
                        id: 3,
                        name: "Jame Smith",
                        age: 30,
                        tel: "0987654321",
                        address: "Chiang Mai, Thailand",
                        userId: 3,
                        imageId: 1,
                        image: {
                            id: 1,
                            path: "1728239317254-Scan_20220113 (2).png",
                            timestamp: new Date("2024-10-10T01:15:14.000Z"),
                            updatedBy: 8
                        }
                    }
                }
            },
            {
                id: 6,
                patrolId: 3,
                checklistId: 4,
                userId: 3,
                checklist: {
                    id: 4,
                    title: "Security Inspection",
                    items: [
                        {
                            id: 10,
                            name: "CCTV Functionality Check",
                            type: "safety",
                            checklistId: 4,
                            itemZones: [
                                {
                                    zone: {
                                        id: 2,
                                        name: "assembly_line_zone",
                                        supervisor: {
                                            id: 4,
                                            profile: {
                                                name: "Michael Johnson"
                                            }
                                        }
                                    }
                                },
                                {
                                    zone: {
                                        id: 3,
                                        name: "raw_materials_storage_zone",
                                        supervisor: {
                                            id: 5,
                                            profile: {
                                                name: "Emily Davis"
                                            }
                                        }
                                    }
                                },
                                {
                                    zone: {
                                        id: 4,
                                        name: "quality_control_zone",
                                        supervisor: {
                                            id: 6,
                                            profile: {
                                                name: "David Wilson"
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            id: 11,
                            name: "Access Control System Check",
                            type: "safety",
                            checklistId: 4,
                            itemZones: [
                                {
                                    zone: {
                                        id: 4,
                                        name: "quality_control_zone",
                                        supervisor: {
                                            id: 6,
                                            profile: {
                                                name: "David Wilson"
                                            }
                                        }
                                    }
                                },
                                {
                                    zone: {
                                        id: 5,
                                        name: "it_zone",
                                        supervisor: {
                                            id: 7,
                                            profile: {
                                                name: "Sophia Taylor"
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    username: "jameSmith",
                    email: null,
                    password: "$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm",
                    role: "inspector",
                    department: null,
                    createdAt: new Date("2024-10-06T10:27:09.916Z"),
                    active: true,
                    profile: {
                        id: 3,
                        name: "Jame Smith",
                        age: 30,
                        tel: "0987654321",
                        address: "Chiang Mai, Thailand",
                        userId: 3,
                        imageId: 1,
                        image: {
                            id: 1,
                            path: "1728239317254-Scan_20220113 (2).png",
                            timestamp: new Date("2024-10-10T01:15:14.000Z"),
                            updatedBy: 8
                        }
                    }
                }
            }
        ],
    };

    const patrolWithPresetAndResult = {
        ...patrol,
        preset: {
            id: 1,
            title: "Daily Cleanliness Check",
            description: "การตรวจสอบความสะอาดและความปลอดภัยในพื้นที่ทำงานประจำวัน โดยเฉพาะการดูแลพื้นและความสะอาดของพื้นที่ต้อนรับ"
        },
        results: [
            {
                id: 1,
                status: true,
                itemId: 8,
                zoneId: 4,
                patrolId: 3,
                defects: [],
                comments: []
            },
            {
                id: 2,
                status: true,
                itemId: 8,
                zoneId: 6,
                patrolId: 3,
                defects: [],
                comments: []
            },
            {
                id: 3,
                status: false,
                itemId: 9,
                zoneId: 6,
                patrolId: 3,
                defects: [
                    {
                        id: 1,
                        name: "Trash Disposal Check",
                        description: "Defect1",
                        type: "environment",
                        status: "reported",
                        timestamp: new Date("2024-12-10T15:44:07.006Z"),
                        userId: 3,
                        patrolResultId: 3
                    }
                ],
                comments: []
            },
            {
                id: 4,
                status: true,
                itemId: 10,
                zoneId: 2,
                patrolId: 3,
                defects: [],
                comments: []
            },
            {
                id: 5,
                status: true,
                itemId: 10,
                zoneId: 3,
                patrolId: 3,
                defects: [],
                comments: []
            },
            {
                id: 6,
                status: true,
                itemId: 10,
                zoneId: 4,
                patrolId: 3,
                defects: [],
                comments: []
            },
            {
                id: 7,
                status: true,
                itemId: 11,
                zoneId: 4,
                patrolId: 3,
                defects: [],
                comments: []
            },
            {
                id: 8,
                status: true,
                itemId: 11,
                zoneId: 5,
                patrolId: 3,
                defects: [],
                comments: []
            }
        ]

    };

    test('should retrieve patrol successfully as admin with preset and result included', async () => {
        prismaMock.patrol.findFirst.mockResolvedValue(patrolWithPresetAndResult);

        const req = {
            params: { id: "3" },
            query: { preset: "true", result: "true" },
            user: {
                role: "inspector",
                userId: 3,
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await getPatrol(req, res);
        console.log(prismaMock.patrol.findFirst.mock.calls[0][0]);

        expect(prismaMock.patrol.findFirst).toHaveBeenCalledWith({
            where: {
                id: 3,
                patrolChecklists: {
                    some: {
                        userId: 3,
                    },
                },
            },
            include: {
                preset: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                    },
                },
                patrolChecklists: {
                    include: {
                        checklist: {
                            select: {
                                id: true,
                                title: true,
                                items: {
                                    include: {
                                        itemZones: {
                                            select: {
                                                zone: {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                        supervisor: {
                                                            select: {
                                                                id: true,
                                                                profile: {
                                                                    select: {
                                                                        name: true,
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
                        },
                        inspector: {
                            include: {
                                profile: {
                                    include: {
                                        image: true,
                                    },
                                },
                            },
                        },
                    },
                },
                results: {
                    include: {
                        defects: true,
                        comments: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        department: true,
                                        role: true,
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
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(patrolWithPresetAndResult);
    });

    //   test('should retrieve patrol successfully as inspector without preset and result', async () => {
    //     prismaMock.patrol.findFirst.mockResolvedValue(patrol);

    //     const req = {
    //       params: { id: "3" },
    //       query: { preset: "false", result: "false" },
    //       user: {
    //         role: "inspector",
    //         userId: 3,
    //       },
    //     } as unknown as Request;

    //     const res = {
    //       status: jest.fn().mockReturnThis(),
    //       json: jest.fn(),
    //     } as unknown as Response;

    //     await getPatrol(req, res);

    //     expect(prismaMock.patrol.findFirst).toHaveBeenCalledWith({
    //       where: {
    //         id: 3,
    //         patrolChecklists: {
    //           some: {
    //             userId: 3,
    //           },
    //         },
    //       },
    //       include: {
    //         preset: undefined,
    //         patrolChecklists: {
    //           include: {
    //             checklist: {
    //               select: {
    //                 id: true,
    //                 title: true,
    //                 items: {
    //                   include: {
    //                     itemZones: {
    //                       select: {
    //                         zone: {
    //                           select: {
    //                             id: true,
    //                             name: true,
    //                             supervisor: {
    //                               select: {
    //                                 id: true,
    //                                 profile: {
    //                                   select: {
    //                                     name: true,
    //                                   },
    //                                 },
    //                               },
    //                             },
    //                           },
    //                         },
    //                       },
    //                     },
    //                   },
    //                 },
    //               },
    //             },
    //             inspector: {
    //               include: {
    //                 profile: {
    //                   include: {
    //                     image: true,
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //         results: undefined,
    //       },
    //     });

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith(patrol);
    //   });

    //   test('should return 403 Forbidden for unauthorized roles', async () => {
    //     const req = {
    //       params: { id: "3" },
    //       query: { preset: "false", result: "false" },
    //       user: {
    //         role: "viewer",
    //         userId: 4,
    //       },
    //     } as unknown as Request;

    //     const res = {
    //       status: jest.fn().mockReturnThis(),
    //       json: jest.fn(),
    //     } as unknown as Response;

    //     await getPatrol(req, res);

    //     expect(prismaMock.patrol.findFirst).not.toHaveBeenCalled();
    //     expect(res.status).toHaveBeenCalledWith(403);
    //     expect(res.json).toHaveBeenCalledWith({ message: "Access Denied: Admins or Inspectors only" });
    //   });

    //   test('should return 404 Not Found when patrol does not exist', async () => {
    //     prismaMock.patrol.findFirst.mockResolvedValue(null);

    //     const req = {
    //       params: { id: "999" },
    //       query: { preset: "false", result: "false" },
    //       user: {
    //         role: "inspector",
    //         userId: 3,
    //       },
    //     } as unknown as Request;

    //     const res = {
    //       status: jest.fn().mockReturnThis(),
    //       json: jest.fn(),
    //     } as unknown as Response;

    //     await getPatrol(req, res);

    //     expect(prismaMock.patrol.findFirst).toHaveBeenCalled();
    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.json).not.toHaveBeenCalled(); // The original code doesn't send a message for 404
    //   });

    //   test('should return 500 Internal Server Error on exception', async () => {
    //     prismaMock.patrol.findFirst.mockRejectedValue(new Error("Database error"));

    //     const req = {
    //       params: { id: "3" },
    //       query: { preset: "false", result: "false" },
    //       user: {
    //         role: "admin",
    //         userId: 1,
    //       },
    //     } as unknown as Request;

    //     const res = {
    //       status: jest.fn().mockReturnThis(),
    //       json: jest.fn(),
    //     } as unknown as Response;

    //     console.error = jest.fn(); // Mock console.error to suppress error logs during tests

    //     await getPatrol(req, res);

    //     expect(prismaMock.patrol.findFirst).toHaveBeenCalled();
    //     expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    //     expect(res.status).toHaveBeenCalledWith(500);
    //     expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    //   });
});
