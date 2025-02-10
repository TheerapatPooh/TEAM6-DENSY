// patrol-controller.test.ts
import './_mocks_/prisma.mock';

import { commentPatrol, createPatrol, finishPatrol, getAllPatrolDefects, getAllPatrols, getPatrol, removePatrol, startPatrol } from '@Controllers/patrol-controller.js';
import { Request, Response } from 'express';
import { allPatrolsMock, allPatrolsResponseMock, createPatrolMock, createPatrolResponseMock, finishPatrolMock, patrolCommentsMock, patrolDefectsMock, patrolMock, startPatrolMock } from './_mocks_/patrol.mock';
import { prismaMock } from './_mocks_/prisma.mock';

// Mock Response object
const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

// Mock Request object
const mockRequest = (query: any, params: any, body: any, user: any) => {
    return {
        query,
        params,
        body,
        user,
    } as unknown as Request;
};

describe('getPatrol', () => {
    test('ควรดึงข้อมูล Patrol ตามเงื่อนไข Inspector ได้ถูกต้อง', async () => {
        prismaMock.patrol.findFirst.mockResolvedValue(patrolMock);

        const req = mockRequest({ preset: 'true', result: 'true' }, { id: '3' }, {}, { userId: 3 });
        const res = mockResponse();

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
                        version: true,
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
        expect(res.json).toHaveBeenCalledWith(patrolMock);

    });
});

describe('getAllPatrols', () => {
    test('ควรดึงข้อมูล Patrol ทั้งหมดตามสถานะและ Inspector ได้ถูกต้อง', async () => {
        prismaMock.patrol.findMany.mockResolvedValueOnce(allPatrolsMock);
        const req = mockRequest({ status: "on_going" }, {}, {}, { userId: 3 });
        const res = mockResponse();

        await getAllPatrols(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(allPatrolsResponseMock);
    });
});

describe('createPatrol', () => {
    test('ควรสร้างข้อมูล Patrol ได้สำเร็จ', async () => {
        prismaMock.patrol.create.mockResolvedValueOnce({ id: 5 });
        prismaMock.patrol.findUnique.mockResolvedValueOnce(createPatrolMock);
        const req = mockRequest(
            {},
            {},
            {
                date: "2026-12-10T17:00:00.000Z",
                presetId: 2,
                checklists: [
                    { checklistId: 2, userId: 3 },
                    { checklistId: 5, userId: 3 },
                ],
            },
            { role: "inspector", userId: 3 });
        const res = mockResponse();

        await createPatrol(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(createPatrolResponseMock);
    });
});

describe('startPatrol', () => {
    test('ควรเริ่มตรวจ Patrol ได้สำเร็จ', async () => {
        prismaMock.patrol.findFirst.mockResolvedValueOnce(startPatrolMock);
        prismaMock.patrol.update.mockResolvedValueOnce({
            id: 10,
            status: "on_going",
            startTime: "2025-01-12T13:58:52.709Z"
        });

        const req = mockRequest(
            {},
            { id: 10 },
            {
                status: 'scheduled',
                checklists: [
                    {
                        "id": 19,
                        "patrolId": 10,
                        "checklistId": 1,
                        "userId": 3,
                        "checklist": {
                            "id": 1,
                            "title": "Safety Inspection",
                            "items": [
                                {
                                    "id": 2,
                                    "name": "Fire Extinguisher Check",
                                    "type": "safety",
                                    "checklistId": 1,
                                    "itemZones": [
                                        {
                                            "zone": {
                                                "id": 2,
                                                "name": "assembly_line_zone",
                                                "supervisor": {
                                                    "id": 4,
                                                    "profile": {
                                                        "name": "Michael Johnson"
                                                    }
                                                }
                                            }
                                        },
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
                                                "name": "quality_control_zone",
                                                "supervisor": {
                                                    "id": 6,
                                                    "profile": {
                                                        "name": "David Wilson"
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
                                }
                            ]
                        },
                        "inspector": {
                            "id": 3,
                            "email": null,
                            "department": null,
                            "role": "inspector",
                            "profile": {
                                "name": "Jame Smith",
                                "image": {
                                    "id": 1,
                                    "path": "1728239317254-Scan_20220113 (2).png",
                                    "timestamp": "2024-10-10T01:15:14.000Z",
                                    "updatedBy": 8
                                }
                            }
                        }
                    },
                    {
                        "id": 20,
                        "patrolId": 10,
                        "checklistId": 4,
                        "userId": 2,
                        "checklist": {
                            "id": 4,
                            "title": "Security Inspection",
                            "items": [
                                {
                                    "id": 10,
                                    "name": "CCTV Functionality Check",
                                    "type": "safety",
                                    "checklistId": 4,
                                    "itemZones": [
                                        {
                                            "zone": {
                                                "id": 2,
                                                "name": "assembly_line_zone",
                                                "supervisor": {
                                                    "id": 4,
                                                    "profile": {
                                                        "name": "Michael Johnson"
                                                    }
                                                }
                                            }
                                        },
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
                                                "id": 4,
                                                "name": "quality_control_zone",
                                                "supervisor": {
                                                    "id": 6,
                                                    "profile": {
                                                        "name": "David Wilson"
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    "id": 11,
                                    "name": "Access Control System Check",
                                    "type": "safety",
                                    "checklistId": 4,
                                    "itemZones": [
                                        {
                                            "zone": {
                                                "id": 4,
                                                "name": "quality_control_zone",
                                                "supervisor": {
                                                    "id": 6,
                                                    "profile": {
                                                        "name": "David Wilson"
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            "zone": {
                                                "id": 5,
                                                "name": "it_zone",
                                                "supervisor": {
                                                    "id": 7,
                                                    "profile": {
                                                        "name": "Sophia Taylor"
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        "inspector": {
                            "id": 2,
                            "email": null,
                            "department": null,
                            "role": "inspector",
                            "profile": {
                                "name": "John Doe",
                                "image": null
                            }
                        }
                    }
                ]
            },
            { role: "inspector", userId: 3 });
        const res = mockResponse();

        await startPatrol(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(startPatrolMock);
    });
});

describe('finishPatrol', () => {
    test('ควรสิ้นสุดการตรวจ Patrol ได้สำเร็จ', async () => {
        prismaMock.patrol.findFirst.mockResolvedValueOnce(finishPatrolMock);
        prismaMock.patrol.update.mockResolvedValueOnce({
            id: 11,
            status: "completed",
            endTime: "2025-01-12T15:14:55.207Z",
            duration: "0h 5m 15s",
        });

        const req = mockRequest(
            {},
            { id: "11" },
            {
                status: 'on_going',
                checklists: [
                    {
                        id: 9,
                        patrolId: 11,
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
                        patrolId: 11,
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
                startTime: new Date("2025-01-12T15:09:40.132Z")
            },
            { role: "inspector", userId: 3 });
        const res = mockResponse();

        await finishPatrol(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(finishPatrolMock);
    });
})

describe('removePatrol', () => {
    test('ควรลบข้อมูล Patrol และรายการที่เกี่ยวข้องได้สำเร็จ', async () => {
        prismaMock.patrol.delete.mockResolvedValue(patrolMock);

        const req = mockRequest(
            {},
            { id: "3" },
            {},
            { role: "inspector", userId: 3 });
        const res = mockResponse();
        await removePatrol(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Patrol and related records successfully deleted" });
    });
})

describe('getAllPatrolDefects', () => {
    test('ควรดึงข้อมูล Patrol และ Defect ที่เกี่ยวข้องได้ถูกต้อง', async () => {
        prismaMock.patrol.findFirst.mockResolvedValue(patrolDefectsMock.patrol);
        prismaMock.defect.findMany.mockResolvedValue(patrolDefectsMock.defects);
        const req = mockRequest(
            {},
            { id: "9" },
            {},
            { role: "inspector", userId: 3 });
        const res = mockResponse();
        await getAllPatrolDefects(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(patrolDefectsMock.defects);
    });
})

describe('commentPatrol', () => {
    test('ควร Comment รายการใน Patrol ได้ถูกต้อง', async () => {
        prismaMock.patrol.findFirst.mockResolvedValue(patrolCommentsMock.patrol);
        prismaMock.comment.create.mockResolvedValue(patrolCommentsMock.comment);

        const req = mockRequest(
            {},
            { id: "9" },
            {
                message: "Test Comment",
                patrolResultId: 17,
                supervisorId: 6,
            },
            { role: "inspector", userId: 3 });
        const res = mockResponse();

        await commentPatrol(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(patrolCommentsMock.comment);
    });
})