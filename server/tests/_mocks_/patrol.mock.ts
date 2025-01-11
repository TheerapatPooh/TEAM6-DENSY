import { ItemType, PatrolStatus } from "@prisma/client";

// __mocks__/patrol.mock.ts
export const patrolMock = {
    "id": 4,
    "date": new Date("2024-01-10T17:00:00.000Z"),
    "startTime": new Date("2025-01-11T16:18:25.503Z"),
    "endTime": new Date("2025-01-11T14:23:36.344Z"),
    "duration": "0h 1m 25s",
    "status": "on_going" as PatrolStatus,
    "presetId": 1,
    "patrolChecklists": [
        {
            "id": 7,
            "patrolId": 4,
            "checklistId": 3,
            "userId": 3,
            "checklist": {
                "id": 3,
                "title": "Cleanliness Inspection",
                "items": [
                    {
                        "id": 8,
                        "name": "Floor Cleanliness Check",
                        "type": "environment" as ItemType,
                        "checklistId": 3,
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
                    },
                    {
                        "id": 9,
                        "name": "Trash Disposal Check",
                        "type": "environment" as ItemType,
                        "checklistId": 3,
                        "itemZones": [
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
                        "timestamp": new Date("2024-10-10T01:15:14.000Z"),
                        "updatedBy": 8
                    }
                }
            }
        },
        {
            "id": 8,
            "patrolId": 4,
            "checklistId": 4,
            "userId": 3,
            "checklist": {
                "id": 4,
                "title": "Security Inspection",
                "items": [
                    {
                        "id": 10,
                        "name": "CCTV Functionality Check",
                        "type": "safety" as ItemType,
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
                        "type": "safety" as ItemType,
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
                "id": 3,
                "email": null,
                "department": null,
                "role": "inspector",
                "profile": {
                    "name": "Jame Smith",
                    "image": {
                        "id": 1,
                        "path": "1728239317254-Scan_20220113 (2).png",
                        "timestamp": new Date("2024-10-10T01:15:14.000Z"),
                        "updatedBy": 8
                    }
                }
            }
        }
    ]
};

export const allPatrolsMock = [
    {
        id: 4,
        date: new Date("2025-01-10T17:00:00.000Z"),
        status: "on_going",
        preset: {
            id: 1,
            title: "Daily Cleanliness Check",
        },
        itemCounts: 8,
        inspectors: [
            {
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
                        timestamp: new Date("2024-10-10T01:15:14.000Z"), // เปลี่ยนเป็น Date Object
                        updatedBy: 8,
                    },
                },
            },
        ],
    },
    {
        id: 6,
        date: new Date("2025-01-10T17:00:00.000Z"),
        status: "on_going",
        preset: {
            id: 2,
            title: "Weekly Maintenance",
        },
        itemCounts: 8,
        inspectors: [
            {
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
                        timestamp: new Date("2024-10-10T01:15:14.000Z"), // เปลี่ยนเป็น Date Object
                        updatedBy: 8,
                    },
                },
            },
            {
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
                    image: null,
                },
            },
        ],
    },
];

export const createPatrolMock = {
    id: 35,
    date: new Date("2024-12-10T17:00:00.000Z"),
    status: "pending",
    preset: {
        id: 2,
        title: "Weekly Maintenance"
    },
    itemCounts: 8,
    inspectors: [
        {
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
    ]
};

export const startPatrolMock = {
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
};

export const finishPatrolMock = {
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
};

export const removePatrolMock = {
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
};

export const patrolDefectsMock = {
    "patrols": {
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
    },
    "defects": [
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
};

export const commentPatrolMock = {
    "patrol": {
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
    },
    "comment": {
        id: 1,
        message: "Comment",
        timestamp: new Date("2024-12-10T17:00:00.000Z"),
        status: false,
        userId: 3,
        patrolResultId: 2,
    }
};