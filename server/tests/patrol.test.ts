import { PatrolStatus } from '@prisma/client'
import { prismaMock } from './singleton'
import { getPatrol } from '@Controllers/patrol-controller.js'

test('should retrieve patrol successfully without preset and result', async () => {
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
        ]
    }

    prismaMock.patrol.findFirst.mockResolvedValue(patrol)
    const req = {
        params: { id: "3" },
        query: { preset: "false", result: "false" },
        user: {
            role: "inspector",
            userId: 3,
        },
    } as any;

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as any;

    // Call the function and assert the result
    await getPatrol(req, res); 

    expect(res.status).toHaveBeenCalledWith(200); 
    expect(res.json).toHaveBeenCalledWith(patrol); 
})
