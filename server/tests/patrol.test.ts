// patrol-controller.test.ts

import { commentPatrol, createPatrol, finishPatrol, getAllPatrolDefects, getAllPatrols, getPatrol, removePatrol, startPatrol } from '@Controllers/patrol-controller.js';
import { prismaMock } from './mock';
import { Request, Response } from 'express';
import { allPatrolsMock, patrolMock, createPatrolMock, startPatrolMock, finishPatrolMock, removePatrolMock, patrolDefectsMock, commentPatrolMock } from './_mocks_/patrol.mock';

describe('getPatrol', () => {
    test('ควรดึงข้อมูล Patrol ตามเงื่อนไข Inspector ได้ถูกต้อง', async () => {
        prismaMock.patrol.findFirst.mockResolvedValue(patrolMock);

        const req = {
            params: { id: "4" },
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

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(patrolMock);

    });
});

describe('getAllPatrols', () => {
    test('ควรดึงข้อมูล Patrol ทั้งหมดตามสถานะและ Inspector ได้ถูกต้อง', async () => {
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

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(allPatrolsMock);
    });
});

describe('createPatrol', () => {
    test('ควรสร้างข้อมูล Patrol ได้สำเร็จ', async () => {
        const req = {
            user: {
                role: "inspector",
                userId: 3,
            },
            body: {
                date: "2024-12-10T17:00:00.000Z",
                presetId: 2,
                checklists: [
                    { checklistId: 2, userId: 3 },
                    { checklistId: 5, userId: 3 },
                ],
            }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as jest.Mocked<Response>;

        await createPatrol(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(createPatrolMock);
    });
})

describe('startPatrol', () => {
    test('ควรเริ่มตรวจ Patrol ได้สำเร็จ', async () => {
        const req = {
            params: { id: "36" },
            user: {
                role: "inspector",
                userId: 3,
            },
            body: {
                status: 'scheduled',
                checklists: [
                    {
                        id: 59,
                        patrolId: 36,
                        checklistId: 1,
                        userId: 3,
                        checklist: {
                            id: 1,
                            title: "Safety Inspection",
                            items: [
                                {
                                    id: 2,
                                    name: "Fire Extinguisher Check",
                                    type: "safety",
                                    checklistId: 1,
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
                                        }
                                    ]
                                },
                                {
                                    "id": 3,
                                    "name": "Emergency Exit Sign Check",
                                    "type": "safety",
                                    "checklistId": 1,
                                    "itemZones": [
                                        {
                                            "zone": {
                                                "id": 3,
                                                "name": "raw_materials_storage_zone",
                                                "supervisor": {
                                                    "id": 5,
                                                    "profile": {
                                                        "name": "Emily Davis"
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            "zone": {
                                                "id": 6,
                                                "name": "customer_service_zone",
                                                "supervisor": {
                                                    "id": 8,
                                                    "profile": {
                                                        "name": "Jack Danial"
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    "id": 4,
                                    "name": "First Aid Kit Check",
                                    "type": "safety",
                                    "checklistId": 1,
                                    "itemZones": [
                                        {
                                            "zone": {
                                                "id": 4,
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
                                }
                            ]
                        },
                        inspector: {
                            id: 3,
                            email: null,
                            department: null,
                            role: "inspector",
                            profile: {
                                name: "Jame Smith",
                                image: {
                                    id: 1,
                                    path: "1728239317254-Scan_20220113 (2).png",
                                    timestamp: "2024-10-10T01:15:14.000Z",
                                    updatedBy: 8
                                }
                            }
                        }
                    },
                    {
                        id: 60,
                        patrolId: 36,
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
                            id: 2,
                            email: null,
                            department: null,
                            role: "inspector",
                            profile: {
                                name: "John Doe",
                                image: null
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

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(startPatrolMock);
    });
})

describe('finishPatrol', () => {
    test('ควรสิ้นสุดการตรวจ Patrol ได้สำเร็จ', async () => {
        prismaMock.patrol.update.mockResolvedValue(finishPatrolMock);

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
        expect(res.json).toHaveBeenCalledWith(finishPatrolMock);
    });
})

describe('removePatrol', () => {
    test('ควรลบข้อมูล Patrol และรายการที่เกี่ยวข้องได้สำเร็จ', async () => {
        prismaMock.patrol.delete.mockResolvedValue(removePatrolMock);

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
    test('ควรดึงข้อมูล Patrol และ Defect ที่เกี่ยวข้องได้ถูกต้อง', async () => {
        prismaMock.patrol.findFirst.mockResolvedValue(patrolDefectsMock.patrols);
        prismaMock.defect.findMany.mockResolvedValue(patrolDefectsMock.defects as any);

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
        expect(res.json).toHaveBeenCalledWith(patrolDefectsMock.defects);
    });
})

describe('commentPatrol', () => {
    test('ควร Comment รายการใน Patrol ได้ถูกต้อง', async () => {
        prismaMock.patrol.findFirst.mockResolvedValue(commentPatrolMock.patrol);
        prismaMock.comment.create.mockResolvedValue(commentPatrolMock.comment);

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
        expect(res.json).toHaveBeenCalledWith(commentPatrolMock.comment);
    });
})
