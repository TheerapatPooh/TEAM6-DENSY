// patrol-controller.test.ts

import { commentPatrol, createPatrol, finishPatrol, getAllPatrolDefects, getAllPatrols, getPatrol, removePatrol, startPatrol } from '@Controllers/patrol-controller.js';
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

    test('should retrieve patrol successfully without preset and result', async () => {
        prismaMock.patrol.findFirst.mockResolvedValue(patrol);

        const req = {
            params: { id: "3" },
            query: { preset: "false", result: "false" },
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
            },
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(patrol);
    });

    test('should retrieve patrol successfully with preset and result included', async () => {
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

    test('should deny access if role is not admin or inspector', async () => {
        prismaMock.patrol.findFirst.mockResolvedValue(patrol);

        const req = {
            params: { id: "3" },
            query: { preset: "false", result: "false" },
            user: {
                role: "",
                userId: null,
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await getPatrol(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Access Denied: Admins or Inspectors only" });
    });

    test('should return 404 if patrol not found', async () => {
        prismaMock.patrol.findFirst.mockResolvedValue(null);

        const req = {
            params: { id: "999" },
            query: { preset: "false", result: "false" },
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

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('should return 500 internal server error', async () => {
        const error = new Error("Database error");
        prismaMock.patrol.findFirst.mockRejectedValueOnce(error);

        const req = {
            params: { id: "3" },
            query: { preset: "false", result: "false" },
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

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" })
    });
});

describe('getAllPatrols', () => {
    const allPatrols = [
        {
            id: 3,
            date: new Date("2024-12-09T17:00:00.000Z"),
            status: "completed",
            preset: {
                title: "Daily Cleanliness Check"
            },
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
                                            name: "quality_control_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 6,
                                            name: "customer_service_zone"
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
                                            name: "customer_service_zone"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    inspector: {
                        id: 3,
                        email: null,
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
                                            name: "assembly_line_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 3,
                                            name: "raw_materials_storage_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 4,
                                            name: "quality_control_zone"
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
                                            name: "quality_control_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 5,
                                            name: "it_zone"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    inspector: {
                        id: 3,
                        email: null,
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
            ]
        },
        {
            id: 4,
            date: new Date("2024-12-10T17:00:00.000Z"),
            status: "on_going",
            preset: {
                title: "Daily Cleanliness Check"
            },
            patrolChecklists: [
                {
                    id: 7,
                    patrolId: 4,
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
                                            name: "quality_control_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 6,
                                            name: "customer_service_zone"
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
                                            name: "customer_service_zone"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    inspector: {
                        id: 3,
                        email: null,
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
                    id: 8,
                    patrolId: 4,
                    checklistId: 4,
                    userId: 2,
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
                                            name: "assembly_line_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 3,
                                            name: "raw_materials_storage_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 4,
                                            name: "quality_control_zone"
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
                                            name: "quality_control_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 5,
                                            name: "it_zone"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    inspector: {
                        id: 2,
                        email: null,
                        profile: {
                            id: 2,
                            name: "John Doe",
                            age: 25,
                            tel: "1234567890",
                            address: "Bangkok, Thailand",
                            userId: 2,
                            imageId: null,
                            image: null
                        }
                    }
                }
            ]
        },
        {
            id: 5,
            date: new Date("2024-12-10T17:00:00.000Z"),
            status: "scheduled",
            preset: {
                title: "Weekly Maintenance"
            },
            patrolChecklists: [
                {
                    id: 9,
                    patrolId: 5,
                    checklistId: 2,
                    userId: 3,
                    checklist: {
                        id: 2,
                        title: "Maintenance Inspection",
                        items: [
                            {
                                id: 5,
                                name: "Electrical Panel Inspection",
                                type: "maintenance",
                                checklistId: 2,
                                itemZones: [
                                    {
                                        zone: {
                                            id: 2,
                                            name: "assembly_line_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 5,
                                            name: "it_zone"
                                        }
                                    }
                                ]
                            },
                            {
                                id: 6,
                                name: "Air Conditioning System Check",
                                type: "maintenance",
                                checklistId: 2,
                                itemZones: [
                                    {
                                        zone: {
                                            id: 5,
                                            name: "it_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 6,
                                            name: "customer_service_zone"
                                        }
                                    }
                                ]
                            },
                            {
                                id: 7,
                                name: "Lighting System Check",
                                type: "maintenance",
                                checklistId: 2,
                                itemZones: [
                                    {
                                        zone: {
                                            id: 2,
                                            name: "assembly_line_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 6,
                                            name: "customer_service_zone"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    inspector: {
                        id: 3,
                        email: null,
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
                    id: 10,
                    patrolId: 5,
                    checklistId: 5,
                    userId: 3,
                    checklist: {
                        id: 5,
                        title: "Equipment Inspection",
                        items: [
                            {
                                id: 12,
                                name: "Server Equipment Inspection",
                                type: "maintenance",
                                checklistId: 5,
                                itemZones: [
                                    {
                                        zone: {
                                            id: 5,
                                            name: "it_zone"
                                        }
                                    }
                                ]
                            },
                            {
                                id: 13,
                                name: "Forklift Maintenance",
                                type: "maintenance",
                                checklistId: 5,
                                itemZones: [
                                    {
                                        zone: {
                                            id: 3,
                                            name: "raw_materials_storage_zone"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    inspector: {
                        id: 3,
                        email: null,
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
            ]
        }
    ]

    const filterPatrol = [
        {
            id: 4,
            date: new Date("2024-12-10T17:00:00.000Z"),
            status: "on_going",
            preset: {
                title: "Daily Cleanliness Check"
            },
            patrolChecklists: [
                {
                    id: 7,
                    patrolId: 4,
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
                                            name: "quality_control_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 6,
                                            name: "customer_service_zone"
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
                                            name: "customer_service_zone"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    inspector: {
                        id: 3,
                        email: null,
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
                    id: 8,
                    patrolId: 4,
                    checklistId: 4,
                    userId: 2,
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
                                            name: "assembly_line_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 3,
                                            name: "raw_materials_storage_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 4,
                                            name: "quality_control_zone"
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
                                            name: "quality_control_zone"
                                        }
                                    },
                                    {
                                        zone: {
                                            id: 5,
                                            name: "it_zone"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    inspector: {
                        id: 2,
                        email: null,
                        profile: {
                            id: 2,
                            name: "John Doe",
                            age: 25,
                            tel: "1234567890",
                            address: "Bangkok, Thailand",
                            userId: 2,
                            imageId: null,
                            image: null
                        }
                    }
                }
            ]
        }
    ]

    test('should retrieve all patrols successfully without filter', async () => {
        prismaMock.patrol.findMany.mockResolvedValue(allPatrols as any);

        const req = {
            query: { status: undefined },
            user: {
                role: "inspector",
                userId: 3,
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await getAllPatrols(req, res);

        expect(prismaMock.patrol.findMany).toHaveBeenCalledWith({
            where: {
                status: undefined,
                patrolChecklists: {
                    some: {
                        userId: 3,
                    },
                },
            },
            select: {
                id: true,
                date: true,
                status: true,
                preset: {
                    select: {
                        title: true,
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
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        inspector: {
                            select: {
                                id: true,
                                email: true,
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

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(allPatrols);
    });

    test('should retrieve all patrols successfully with On Going status filter', async () => {
        prismaMock.patrol.findMany.mockResolvedValue(filterPatrol as any);

        const req = {
            query: { status: "on_going" },
            user: {
                role: "inspector",
                userId: 3,
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await getAllPatrols(req, res);

        expect(prismaMock.patrol.findMany).toHaveBeenCalledWith({
            where: {
                status: 'on_going' as PatrolStatus,
                patrolChecklists: {
                    some: {
                        userId: 3,
                    },
                },
            },
            select: {
                id: true,
                date: true,
                status: true,
                preset: {
                    select: {
                        title: true,
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
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        inspector: {
                            select: {
                                id: true,
                                email: true,
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

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(filterPatrol);
    });

    test('should deny access if role is not admin or inspector', async () => {
        prismaMock.patrol.findMany.mockResolvedValue(allPatrols as any);

        const req = {
            query: { status: undefined },
            user: {
                role: "supervisor",
                userId: 12,
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await getAllPatrols(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Access Denied: Admins or Inspectors only" });
    });

    test('should return 500 internal server error', async () => {
        const error = new Error("Database error");
        prismaMock.patrol.findMany.mockRejectedValueOnce(error);

        const req = {
            query: { status: undefined },
            user: {
                role: "inspector",
                userId: 3,
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await getAllPatrols(req, res);

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" })
    });
});

describe('createPatrol', () => {
    const patrol = {
        id: 5,
        date: new Date("2024-12-10T17:00:00.000Z"),
        startTime: null,
        endTime: null,
        duration: null,
        status: "scheduled" as PatrolStatus,
        presetId: 2,
        preset: {
            title: "Weekly Maintenance"
        },
        patrolChecklists: [
            {
                id: 9,
                patrolId: 5,
                checklistId: 2,
                userId: 3,
                checklist: {
                    id: 2,
                    title: "Maintenance Inspection",
                    items: [
                        {
                            id: 5,
                            name: "Electrical Panel Inspection",
                            type: "maintenance",
                            checklistId: 2,
                            itemZones: [
                                {
                                    zone: {
                                        id: 2,
                                        name: "assembly_line_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 5,
                                        name: "it_zone"
                                    }
                                }
                            ]
                        },
                        {
                            id: 6,
                            name: "Air Conditioning System Check",
                            type: "maintenance",
                            checklistId: 2,
                            itemZones: [
                                {
                                    zone: {
                                        id: 5,
                                        name: "it_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 6,
                                        name: "customer_service_zone"
                                    }
                                }
                            ]
                        },
                        {
                            id: 7,
                            name: "Lighting System Check",
                            type: "maintenance",
                            checklistId: 2,
                            itemZones: [
                                {
                                    zone: {
                                        id: 2,
                                        name: "assembly_line_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 6,
                                        name: "customer_service_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    email: null,
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
                id: 10,
                patrolId: 5,
                checklistId: 5,
                userId: 3,
                checklist: {
                    id: 5,
                    title: "Equipment Inspection",
                    items: [
                        {
                            id: 12,
                            name: "Server Equipment Inspection",
                            type: "maintenance",
                            checklistId: 5,
                            itemZones: [
                                {
                                    zone: {
                                        id: 5,
                                        name: "it_zone"
                                    }
                                }
                            ]
                        },
                        {
                            id: 13,
                            name: "Forklift Maintenance",
                            type: "maintenance",
                            checklistId: 5,
                            itemZones: [
                                {
                                    zone: {
                                        id: 3,
                                        name: "raw_materials_storage_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    email: null,
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
        ]
    }

    test('should create a patrol successfully', async () => {
        prismaMock.patrol.create.mockResolvedValue(patrol);

        const req = {
            user: {
                role: "inspector",
                userId: 3,
            },
            body: {
                date: new Date("2024-12-10T17:00:00.000Z"),
                presetId: 2,
                checklists: [
                    {
                        id: 9,
                        patrolId: 5,
                        checklistId: 2,
                        userId: 3,
                        checklist: {
                            id: 2,
                            title: "Maintenance Inspection",
                            items: [
                                {
                                    id: 5,
                                    name: "Electrical Panel Inspection",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 2,
                                                name: "assembly_line_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 6,
                                    name: "Air Conditioning System Check",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 6,
                                                name: "customer_service_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 7,
                                    name: "Lighting System Check",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 2,
                                                name: "assembly_line_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 6,
                                                name: "customer_service_zone"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        inspector: {
                            id: 3,
                            email: null,
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
                        id: 10,
                        patrolId: 5,
                        checklistId: 5,
                        userId: 3,
                        checklist: {
                            id: 5,
                            title: "Equipment Inspection",
                            items: [
                                {
                                    id: 12,
                                    name: "Server Equipment Inspection",
                                    type: "maintenance",
                                    checklistId: 5,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 13,
                                    name: "Forklift Maintenance",
                                    type: "maintenance",
                                    checklistId: 5,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 3,
                                                name: "raw_materials_storage_zone"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        inspector: {
                            id: 3,
                            email: null,
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
                ]
            }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await createPatrol(req, res);


        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(patrol);
    });

    test('should deny access if role is not admin or inspector', async () => {
        prismaMock.patrol.create.mockResolvedValue(patrol);

        const req = {
            user: {
                role: "supervisor",
                userId: 12,
            },
            body: {
                date: new Date("2024-12-10T17:00:00.000Z"),
                presetId: 2,
                checklists: [
                    {
                        id: 9,
                        patrolId: 5,
                        checklistId: 2,
                        userId: 3,
                        checklist: {
                            id: 2,
                            title: "Maintenance Inspection",
                            items: [
                                {
                                    id: 5,
                                    name: "Electrical Panel Inspection",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 2,
                                                name: "assembly_line_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 6,
                                    name: "Air Conditioning System Check",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 6,
                                                name: "customer_service_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 7,
                                    name: "Lighting System Check",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 2,
                                                name: "assembly_line_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 6,
                                                name: "customer_service_zone"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        inspector: {
                            id: 3,
                            email: null,
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
                        id: 10,
                        patrolId: 5,
                        checklistId: 5,
                        userId: 3,
                        checklist: {
                            id: 5,
                            title: "Equipment Inspection",
                            items: [
                                {
                                    id: 12,
                                    name: "Server Equipment Inspection",
                                    type: "maintenance",
                                    checklistId: 5,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 13,
                                    name: "Forklift Maintenance",
                                    type: "maintenance",
                                    checklistId: 5,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 3,
                                                name: "raw_materials_storage_zone"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        inspector: {
                            id: 3,
                            email: null,
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
                ]
            }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await createPatrol(req, res);


        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Access Denied: Admins or Inspector only" });
    });

    test('should return 500 internal server error', async () => {
        const error = new Error("Database error");
        prismaMock.patrol.create.mockRejectedValueOnce(error);

        const req = {
            user: {
                role: "inspector",
                userId: 3,
            },
            body: {
                date: new Date("2024-12-10T17:00:00.000Z"),
                presetId: 2,
                checklists: [
                    {
                        id: 9,
                        patrolId: 5,
                        checklistId: 2,
                        userId: 3,
                        checklist: {
                            id: 2,
                            title: "Maintenance Inspection",
                            items: [
                                {
                                    id: 5,
                                    name: "Electrical Panel Inspection",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 2,
                                                name: "assembly_line_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 6,
                                    name: "Air Conditioning System Check",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 6,
                                                name: "customer_service_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 7,
                                    name: "Lighting System Check",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 2,
                                                name: "assembly_line_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 6,
                                                name: "customer_service_zone"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        inspector: {
                            id: 3,
                            email: null,
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
                        id: 10,
                        patrolId: 5,
                        checklistId: 5,
                        userId: 3,
                        checklist: {
                            id: 5,
                            title: "Equipment Inspection",
                            items: [
                                {
                                    id: 12,
                                    name: "Server Equipment Inspection",
                                    type: "maintenance",
                                    checklistId: 5,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 13,
                                    name: "Forklift Maintenance",
                                    type: "maintenance",
                                    checklistId: 5,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 3,
                                                name: "raw_materials_storage_zone"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        inspector: {
                            id: 3,
                            email: null,
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
                ]
            }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await createPatrol(req, res);

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" })
    });
})

describe('startPatrol', () => {
    const patrol = {
        id: 4,
        date: new Date("2024-12-10T17:00:00.000Z"),
        startTime: new Date("2024-12-10T17:00:00.000Z"),
        endTime: null,
        duration: null,
        status: "scheduled" as PatrolStatus,
        presetId: 1,
        preset: {
            title: "Daily Cleanliness Check"
        },
        patrolChecklists: [
            {
                id: 7,
                patrolId: 4,
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
                                        name: "quality_control_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 6,
                                        name: "customer_service_zone"
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
                                        name: "customer_service_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    email: null,
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
                id: 8,
                patrolId: 4,
                checklistId: 4,
                userId: 2,
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
                                        name: "assembly_line_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 3,
                                        name: "raw_materials_storage_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 4,
                                        name: "quality_control_zone"
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
                                        name: "quality_control_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 5,
                                        name: "it_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 2,
                    email: null,
                    profile: {
                        id: 2,
                        name: "John Doe",
                        age: 25,
                        tel: "1234567890",
                        address: "Bangkok, Thailand",
                        userId: 2,
                        imageId: null,
                        image: null
                    }
                }
            }
        ]
    }

    test('should start a patrol successfully', async () => {
        prismaMock.patrol.update.mockResolvedValue(patrol);

        const req = {
            params: { id: "4" },
            user: {
                role: "inspector",
                userId: 3,
            },
            body: {
                status: 'scheduled',
                checklists: [
                    {
                        id: 9,
                        patrolId: 5,
                        checklistId: 2,
                        userId: 3,
                        checklist: {
                            id: 2,
                            title: "Maintenance Inspection",
                            items: [
                                {
                                    id: 5,
                                    name: "Electrical Panel Inspection",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 2,
                                                name: "assembly_line_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 6,
                                    name: "Air Conditioning System Check",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 6,
                                                name: "customer_service_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 7,
                                    name: "Lighting System Check",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 2,
                                                name: "assembly_line_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 6,
                                                name: "customer_service_zone"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        inspector: {
                            id: 3,
                            email: null,
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
                        id: 10,
                        patrolId: 5,
                        checklistId: 5,
                        userId: 3,
                        checklist: {
                            id: 5,
                            title: "Equipment Inspection",
                            items: [
                                {
                                    id: 12,
                                    name: "Server Equipment Inspection",
                                    type: "maintenance",
                                    checklistId: 5,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 13,
                                    name: "Forklift Maintenance",
                                    type: "maintenance",
                                    checklistId: 5,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 3,
                                                name: "raw_materials_storage_zone"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        inspector: {
                            id: 3,
                            email: null,
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
                ]
            }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await startPatrol(req, res);

        expect(prismaMock.patrol.update).toHaveBeenCalledWith({
            where: {
                id: 4,
            },
            data: {
                status: "on_going",
                startTime: expect.any(Date),
            },
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(patrol);
    });
})

describe('finishPatrol', () => {
    const patrol = {
        id: 3,
        date: new Date("2024-12-10T17:00:00.000Z"),
        startTime: new Date("2024-12-10T17:00:00.000Z"),
        endTime: null,
        duration: null,
        status: "completed" as PatrolStatus,
        presetId: 1,
        preset: {
            title: "Daily Cleanliness Check"
        },
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
                                        name: "quality_control_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 6,
                                        name: "customer_service_zone"
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
                                        name: "customer_service_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    email: null,
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
                                        name: "assembly_line_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 3,
                                        name: "raw_materials_storage_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 4,
                                        name: "quality_control_zone"
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
                                        name: "quality_control_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 5,
                                        name: "it_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    email: null,
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
        ]
    }
    test('should start a patrol successfully', async () => {
        prismaMock.patrol.update.mockResolvedValue(patrol);

        const req = {
            params: { id: "3" },
            user: {
                role: "inspector",
                userId: 3,
            },
            body: {
                status: 'on_going',
                checklists: [
                    {
                        id: 9,
                        patrolId: 5,
                        checklistId: 2,
                        userId: 3,
                        checklist: {
                            id: 2,
                            title: "Maintenance Inspection",
                            items: [
                                {
                                    id: 5,
                                    name: "Electrical Panel Inspection",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 2,
                                                name: "assembly_line_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 6,
                                    name: "Air Conditioning System Check",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 6,
                                                name: "customer_service_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 7,
                                    name: "Lighting System Check",
                                    type: "maintenance",
                                    checklistId: 2,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 2,
                                                name: "assembly_line_zone"
                                            }
                                        },
                                        {
                                            zone: {
                                                id: 6,
                                                name: "customer_service_zone"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        inspector: {
                            id: 3,
                            email: null,
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
                        id: 10,
                        patrolId: 5,
                        checklistId: 5,
                        userId: 3,
                        checklist: {
                            id: 5,
                            title: "Equipment Inspection",
                            items: [
                                {
                                    id: 12,
                                    name: "Server Equipment Inspection",
                                    type: "maintenance",
                                    checklistId: 5,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 5,
                                                name: "it_zone"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 13,
                                    name: "Forklift Maintenance",
                                    type: "maintenance",
                                    checklistId: 5,
                                    itemZones: [
                                        {
                                            zone: {
                                                id: 3,
                                                name: "raw_materials_storage_zone"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        inspector: {
                            id: 3,
                            email: null,
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
                                timestamp: "2024-12-10T15:44:07.006Z",
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
                ],
                startTime: new Date("2024-12-10T17:00:00.000Z")
            }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await finishPatrol(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(patrol);
    });
})

describe('removePatrol', () => {
    const patrol = {
        id: 3,
        date: new Date("2024-12-10T17:00:00.000Z"),
        startTime: new Date("2024-12-10T17:00:00.000Z"),
        endTime: null,
        duration: null,
        status: "completed" as PatrolStatus,
        presetId: 1,
        preset: {
            title: "Daily Cleanliness Check"
        },
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
                                        name: "quality_control_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 6,
                                        name: "customer_service_zone"
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
                                        name: "customer_service_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    email: null,
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
                                        name: "assembly_line_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 3,
                                        name: "raw_materials_storage_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 4,
                                        name: "quality_control_zone"
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
                                        name: "quality_control_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 5,
                                        name: "it_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    email: null,
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
        ]
    }

    test('should remove a patrol successfully', async () => {
        prismaMock.patrol.delete.mockResolvedValue(patrol);

        const req = {
            params: { id: "3" },
            user: {
                role: "inspector",
                userId: 3,
            }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await removePatrol(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Patrol and related records successfully deleted" });
    });
})

describe('getAllPatrolDefects', () => {
    const patrol = {
        id: 3,
        date: new Date("2024-12-10T17:00:00.000Z"),
        startTime: new Date("2024-12-10T17:00:00.000Z"),
        endTime: null,
        duration: null,
        status: "completed" as PatrolStatus,
        presetId: 1,
        preset: {
            title: "Daily Cleanliness Check"
        },
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
                                        name: "quality_control_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 6,
                                        name: "customer_service_zone"
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
                                        name: "customer_service_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    email: null,
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
                                        name: "assembly_line_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 3,
                                        name: "raw_materials_storage_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 4,
                                        name: "quality_control_zone"
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
                                        name: "quality_control_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 5,
                                        name: "it_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    email: null,
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
        ]
    }

    const defects = [
        {
            id: 1,
            name: "Trash Disposal Check",
            description: "Defect1",
            type: "environment",
            status: "reported",
            timestamp: new Date("2024-12-10T15:44:07.006Z"),
            userId: 3,
            patrolResultId: 3,
            patrolResult: {
                zoneId: 6
            },
            images: [
                {
                    image: {
                        id: 2,
                        path: "1733845446988-Screenshot_urd_darche_cup_2021_hanoi_street_circuit_31-7-124-4-32-38.jpg",
                        user: {
                            id: 3,
                            username: "jameSmith",
                            email: null,
                            password: "$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm",
                            role: "inspector",
                            department: null,
                            createdAt: new Date("2024-10-06T10:27:09.916Z"),
                            active: true
                        }
                    }
                }
            ]
        }
    ]

    test('should get all patrol defects successfully', async () => {
        prismaMock.patrol.findFirst.mockResolvedValue(patrol);
        prismaMock.defect.findMany.mockResolvedValue(defects as any);

        const req = {
            params: { id: "3" },
            user: {
                role: "inspector",
                userId: 3,
            }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await getAllPatrolDefects(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(defects);
    });
})

describe('commentPatrol', () => {
    const patrol = {
        id: 3,
        date: new Date("2024-12-10T17:00:00.000Z"),
        startTime: new Date("2024-12-10T17:00:00.000Z"),
        endTime: null,
        duration: null,
        status: "on_going" as PatrolStatus,
        presetId: 1,
        preset: {
            title: "Daily Cleanliness Check"
        },
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
                                        name: "quality_control_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 6,
                                        name: "customer_service_zone"
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
                                        name: "customer_service_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    email: null,
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
                                        name: "assembly_line_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 3,
                                        name: "raw_materials_storage_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 4,
                                        name: "quality_control_zone"
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
                                        name: "quality_control_zone"
                                    }
                                },
                                {
                                    zone: {
                                        id: 5,
                                        name: "it_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                inspector: {
                    id: 3,
                    email: null,
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
        ]
    }

    const comment = {
        id: 1,
        message: "Comment",
        timestamp: new Date("2024-12-10T17:00:00.000Z"),
        userId: 3,
        patrolResultId: 2,
    }

    test('should comment patrol successfully', async () => {
        prismaMock.patrol.findFirst.mockResolvedValue(patrol);
        prismaMock.comment.create.mockResolvedValue(comment);

        const req = {
            params: { id: "3" },
            user: {
                role: "inspector",
                userId: 3,
            },
            body: {
                message: "Comment",
                patrolResultId: 2,
            }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await commentPatrol(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(comment);
    });
})
