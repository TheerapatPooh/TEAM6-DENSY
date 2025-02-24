// __mocks__/patrol.mock.ts
export const patrolMock = {
    "id": 3,
    "date": "2025-02-22T17:00:00.000Z",
    "startTime": "2025-02-23T14:54:08.462Z",
    "endTime": "2025-02-23T15:12:16.422Z",
    "duration": "0h 18m 7s",
    "status": "completed",
    "presetId": 1,
    "preset": {
        "id": 1,
        "title": "ASSEMBLY LINE ZONE",
        "description": "โซนสำหรับการประกอบชิ้นส่วนและผลิตสินค้า ตรวจสอบความเรียบร้อยของสายการผลิตและเครื่องจักร",
        "version": 1
    },
    "patrolChecklists": [
        {
            "id": 7,
            "patrolId": 3,
            "checklistId": 1,
            "userId": 3,
            "checklist": {
                "id": 1,
                "title": "Safety Inspection",
                "items": [
                    {
                        "id": 1,
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
                                        "username": "supervisor2",
                                        "email": "supervisor2@example.com",
                                        "role": "supervisor",
                                        "profile": {
                                            "name": "Michael Johnson",
                                            "tel": "1122334455",
                                            "image": null
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "name": "Emergency Exit Sign Check",
                        "type": "safety",
                        "checklistId": 1,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 2,
                                    "name": "assembly_line_zone",
                                    "supervisor": {
                                        "id": 4,
                                        "username": "supervisor2",
                                        "email": "supervisor2@example.com",
                                        "role": "supervisor",
                                        "profile": {
                                            "name": "Michael Johnson",
                                            "tel": "1122334455",
                                            "image": null
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "name": "First Aid Kit Check",
                        "type": "safety",
                        "checklistId": 1,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 2,
                                    "name": "assembly_line_zone",
                                    "supervisor": {
                                        "id": 4,
                                        "username": "supervisor2",
                                        "email": "supervisor2@example.com",
                                        "role": "supervisor",
                                        "profile": {
                                            "name": "Michael Johnson",
                                            "tel": "1122334455",
                                            "image": null
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
                "username": "inspector2",
                "role": "inspector",
                "profile": {
                    "name": "Jame Smith",
                    "tel": "0987654321",
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
            "id": 8,
            "patrolId": 3,
            "checklistId": 2,
            "userId": 2,
            "checklist": {
                "id": 2,
                "title": "Maintenance Inspection",
                "items": [
                    {
                        "id": 4,
                        "name": "Electrical Panel Inspection",
                        "type": "maintenance",
                        "checklistId": 2,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 2,
                                    "name": "assembly_line_zone",
                                    "supervisor": {
                                        "id": 4,
                                        "username": "supervisor2",
                                        "email": "supervisor2@example.com",
                                        "role": "supervisor",
                                        "profile": {
                                            "name": "Michael Johnson",
                                            "tel": "1122334455",
                                            "image": null
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "id": 5,
                        "name": "Air Conditioning System Check",
                        "type": "maintenance",
                        "checklistId": 2,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 2,
                                    "name": "assembly_line_zone",
                                    "supervisor": {
                                        "id": 4,
                                        "username": "supervisor2",
                                        "email": "supervisor2@example.com",
                                        "role": "supervisor",
                                        "profile": {
                                            "name": "Michael Johnson",
                                            "tel": "1122334455",
                                            "image": null
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "id": 6,
                        "name": "Lighting System Check",
                        "type": "maintenance",
                        "checklistId": 2,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 2,
                                    "name": "assembly_line_zone",
                                    "supervisor": {
                                        "id": 4,
                                        "username": "supervisor2",
                                        "email": "supervisor2@example.com",
                                        "role": "supervisor",
                                        "profile": {
                                            "name": "Michael Johnson",
                                            "tel": "1122334455",
                                            "image": null
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
                "username": "inspector1",
                "role": "inspector",
                "profile": {
                    "name": "John Doe",
                    "tel": "1234567890",
                    "image": null
                }
            }
        },
        {
            "id": 9,
            "patrolId": 3,
            "checklistId": 3,
            "userId": 2,
            "checklist": {
                "id": 3,
                "title": "Cleanliness Inspection",
                "items": [
                    {
                        "id": 7,
                        "name": "Floor Cleanliness Check",
                        "type": "environment",
                        "checklistId": 3,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 2,
                                    "name": "assembly_line_zone",
                                    "supervisor": {
                                        "id": 4,
                                        "username": "supervisor2",
                                        "email": "supervisor2@example.com",
                                        "role": "supervisor",
                                        "profile": {
                                            "name": "Michael Johnson",
                                            "tel": "1122334455",
                                            "image": null
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "id": 8,
                        "name": "Trash Disposal Check",
                        "type": "environment",
                        "checklistId": 3,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 2,
                                    "name": "assembly_line_zone",
                                    "supervisor": {
                                        "id": 4,
                                        "username": "supervisor2",
                                        "email": "supervisor2@example.com",
                                        "role": "supervisor",
                                        "profile": {
                                            "name": "Michael Johnson",
                                            "tel": "1122334455",
                                            "image": null
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "id": 9,
                        "name": "Water Quality Inspection",
                        "type": "environment",
                        "checklistId": 3,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 2,
                                    "name": "assembly_line_zone",
                                    "supervisor": {
                                        "id": 4,
                                        "username": "supervisor2",
                                        "email": "supervisor2@example.com",
                                        "role": "supervisor",
                                        "profile": {
                                            "name": "Michael Johnson",
                                            "tel": "1122334455",
                                            "image": null
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
                "username": "inspector1",
                "role": "inspector",
                "profile": {
                    "name": "John Doe",
                    "tel": "1234567890",
                    "image": null
                }
            }
        }
    ],
    "results": [
        {
            "id": 19,
            "status": true,
            "itemId": 1,
            "zoneId": 2,
            "patrolId": 3,
            "supervisorId": 4,
            "supervisor": {
                "id": 4,
                "username": "supervisor2",
                "email": "supervisor2@example.com",
                "role": "supervisor",
                "profile": {
                    "name": "Michael Johnson",
                    "tel": "1122334455",
                    "image": null
                }
            },
            "defects": [],
            "comments": []
        },
        {
            "id": 20,
            "status": true,
            "itemId": 2,
            "zoneId": 2,
            "patrolId": 3,
            "supervisorId": 4,
            "supervisor": {
                "id": 4,
                "username": "supervisor2",
                "email": "supervisor2@example.com",
                "role": "supervisor",
                "profile": {
                    "name": "Michael Johnson",
                    "tel": "1122334455",
                    "image": null
                }
            },
            "defects": [],
            "comments": []
        },
        {
            "id": 21,
            "status": true,
            "itemId": 3,
            "zoneId": 2,
            "patrolId": 3,
            "supervisorId": 4,
            "supervisor": {
                "id": 4,
                "username": "supervisor2",
                "email": "supervisor2@example.com",
                "role": "supervisor",
                "profile": {
                    "name": "Michael Johnson",
                    "tel": "1122334455",
                    "image": null
                }
            },
            "defects": [],
            "comments": []
        },
        {
            "id": 22,
            "status": true,
            "itemId": 4,
            "zoneId": 2,
            "patrolId": 3,
            "supervisorId": 4,
            "supervisor": {
                "id": 4,
                "username": "supervisor2",
                "email": "supervisor2@example.com",
                "role": "supervisor",
                "profile": {
                    "name": "Michael Johnson",
                    "tel": "1122334455",
                    "image": null
                }
            },
            "defects": [],
            "comments": []
        },
        {
            "id": 23,
            "status": false,
            "itemId": 5,
            "zoneId": 2,
            "patrolId": 3,
            "supervisorId": 4,
            "supervisor": {
                "id": 4,
                "username": "supervisor2",
                "email": "supervisor2@example.com",
                "role": "supervisor",
                "profile": {
                    "name": "Michael Johnson",
                    "tel": "1122334455",
                    "image": null
                }
            },
            "defects": [],
            "comments": []
        },
        {
            "id": 24,
            "status": true,
            "itemId": 6,
            "zoneId": 2,
            "patrolId": 3,
            "supervisorId": 4,
            "supervisor": {
                "id": 4,
                "username": "supervisor2",
                "email": "supervisor2@example.com",
                "role": "supervisor",
                "profile": {
                    "name": "Michael Johnson",
                    "tel": "1122334455",
                    "image": null
                }
            },
            "defects": [],
            "comments": []
        },
        {
            "id": 25,
            "status": true,
            "itemId": 7,
            "zoneId": 2,
            "patrolId": 3,
            "supervisorId": 4,
            "supervisor": {
                "id": 4,
                "username": "supervisor2",
                "email": "supervisor2@example.com",
                "role": "supervisor",
                "profile": {
                    "name": "Michael Johnson",
                    "tel": "1122334455",
                    "image": null
                }
            },
            "defects": [],
            "comments": []
        },
        {
            "id": 26,
            "status": true,
            "itemId": 8,
            "zoneId": 2,
            "patrolId": 3,
            "supervisorId": 4,
            "supervisor": {
                "id": 4,
                "username": "supervisor2",
                "email": "supervisor2@example.com",
                "role": "supervisor",
                "profile": {
                    "name": "Michael Johnson",
                    "tel": "1122334455",
                    "image": null
                }
            },
            "defects": [],
            "comments": []
        },
        {
            "id": 27,
            "status": true,
            "itemId": 9,
            "zoneId": 2,
            "patrolId": 3,
            "supervisorId": 4,
            "supervisor": {
                "id": 4,
                "username": "supervisor2",
                "email": "supervisor2@example.com",
                "role": "supervisor",
                "profile": {
                    "name": "Michael Johnson",
                    "tel": "1122334455",
                    "image": null
                }
            },
            "defects": [],
            "comments": []
        }
    ]
};

export const allPatrolsMock = [
    {
        "id": 3,
        "date": "2025-01-11T17:00:00.000Z",
        "status": "on_going",
        "preset": {
            "id": 1,
            "title": "Daily Cleanliness Check"
        },
        "patrolChecklists": [
            {
                "id": 5,
                "patrolId": 3,
                "checklistId": 3,
                "userId": 3,
                "checklist": {
                    "id": 3,
                    "title": "Cleanliness Inspection",
                    "items": [
                        {
                            "id": 8,
                            "name": "Floor Cleanliness Check",
                            "type": "environment",
                            "checklistId": 3,
                            "itemZones": [
                                {
                                    "zone": {
                                        "id": 4,
                                        "name": "quality_control_zone"
                                    }
                                },
                                {
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone"
                                    }
                                }
                            ]
                        },
                        {
                            "id": 9,
                            "name": "Trash Disposal Check",
                            "type": "environment",
                            "checklistId": 3,
                            "itemZones": [
                                {
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                "inspector": {
                    "id": 3,
                    "email": null,
                    "profile": {
                        "id": 3,
                        "name": "Jame Smith",
                        "age": 30,
                        "tel": "0987654321",
                        "address": "Chiang Mai, Thailand",
                        "userId": 3,
                        "imageId": 1,
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
                "id": 6,
                "patrolId": 3,
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
                                        "name": "assembly_line_zone"
                                    }
                                },
                                {
                                    "zone": {
                                        "id": 3,
                                        "name": "raw_materials_storage_zone"
                                    }
                                },
                                {
                                    "zone": {
                                        "id": 4,
                                        "name": "quality_control_zone"
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
                                        "name": "quality_control_zone"
                                    }
                                },
                                {
                                    "zone": {
                                        "id": 5,
                                        "name": "it_zone"
                                    }
                                }
                            ]
                        }
                    ]
                },
                "inspector": {
                    "id": 2,
                    "email": null,
                    "profile": {
                        "id": 2,
                        "name": "John Doe",
                        "age": 25,
                        "tel": "1234567890",
                        "address": "Bangkok, Thailand",
                        "userId": 2,
                        "imageId": null,
                        "image": null
                    }
                }
            }
        ]
    }
];

export const allPatrolsResponseMock = [
    {
        "id": 3,
        "date": "2025-01-11T17:00:00.000Z",
        "disabled": false,
        "status": "on_going",
        "preset": {
            "id": 1,
            "title": "Daily Cleanliness Check"
        },
        "itemCounts": 8,
        "inspectors": [
            {
                "id": 3,
                "email": null,
                "profile": {
                    "id": 3,
                    "name": "Jame Smith",
                    "age": 30,
                    "tel": "0987654321",
                    "address": "Chiang Mai, Thailand",
                    "userId": 3,
                    "imageId": 1,
                    "image": {
                        "id": 1,
                        "path": "1728239317254-Scan_20220113 (2).png",
                        "timestamp": "2024-10-10T01:15:14.000Z",
                        "updatedBy": 8
                    }
                }
            },
            {
                "id": 2,
                "email": null,
                "profile": {
                    "id": 2,
                    "name": "John Doe",
                    "age": 25,
                    "tel": "1234567890",
                    "address": "Bangkok, Thailand",
                    "userId": 2,
                    "imageId": null,
                    "image": null
                }
            }
        ]
    }
];

export const createPatrolMock = {
    "id": 5,
    "date": "2026-12-10T17:00:00.000Z",
    "status": "pending",
    "preset": {
        "id": 2,
        "title": "Weekly Maintenance"
    },
    "patrolChecklists": [
        {
            "id": 11,
            "patrolId": 6,
            "checklistId": 2,
            "userId": 3,
            "checklist": {
                "id": 2,
                "title": "Maintenance Inspection",
                "items": [
                    {
                        "id": 5,
                        "name": "Electrical Panel Inspection",
                        "type": "maintenance",
                        "checklistId": 2,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 2,
                                    "name": "assembly_line_zone"
                                }
                            },
                            {
                                "zone": {
                                    "id": 5,
                                    "name": "it_zone"
                                }
                            }
                        ]
                    },
                    {
                        "id": 6,
                        "name": "Air Conditioning System Check",
                        "type": "maintenance",
                        "checklistId": 2,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 5,
                                    "name": "it_zone"
                                }
                            },
                            {
                                "zone": {
                                    "id": 6,
                                    "name": "customer_service_zone"
                                }
                            }
                        ]
                    },
                    {
                        "id": 7,
                        "name": "Lighting System Check",
                        "type": "maintenance",
                        "checklistId": 2,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 2,
                                    "name": "assembly_line_zone"
                                }
                            },
                            {
                                "zone": {
                                    "id": 6,
                                    "name": "customer_service_zone"
                                }
                            }
                        ]
                    }
                ]
            },
            "inspector": {
                "id": 3,
                "email": null,
                "profile": {
                    "id": 3,
                    "name": "Jame Smith",
                    "age": 30,
                    "tel": "0987654321",
                    "address": "Chiang Mai, Thailand",
                    "userId": 3,
                    "imageId": 1,
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
            "id": 12,
            "patrolId": 6,
            "checklistId": 5,
            "userId": 3,
            "checklist": {
                "id": 5,
                "title": "Equipment Inspection",
                "items": [
                    {
                        "id": 12,
                        "name": "Server Equipment Inspection",
                        "type": "maintenance",
                        "checklistId": 5,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 5,
                                    "name": "it_zone"
                                }
                            }
                        ]
                    },
                    {
                        "id": 13,
                        "name": "Forklift Maintenance",
                        "type": "maintenance",
                        "checklistId": 5,
                        "itemZones": [
                            {
                                "zone": {
                                    "id": 3,
                                    "name": "raw_materials_storage_zone"
                                }
                            }
                        ]
                    }
                ]
            },
            "inspector": {
                "id": 3,
                "email": null,
                "profile": {
                    "id": 3,
                    "name": "Jame Smith",
                    "age": 30,
                    "tel": "0987654321",
                    "address": "Chiang Mai, Thailand",
                    "userId": 3,
                    "imageId": 1,
                    "image": {
                        "id": 1,
                        "path": "1728239317254-Scan_20220113 (2).png",
                        "timestamp": "2024-10-10T01:15:14.000Z",
                        "updatedBy": 8
                    }
                }
            }
        }
    ]
};

export const createPatrolResponseMock = {
    "id": 5,
    "date": "2026-12-10T17:00:00.000Z",
    "status": "pending",
    "preset": {
        "id": 2,
        "title": "Weekly Maintenance"
    },
    "itemCounts": 8,
    "inspectors": [
        {
            "id": 3,
            "email": null,
            "profile": {
                "id": 3,
                "name": "Jame Smith",
                "age": 30,
                "tel": "0987654321",
                "address": "Chiang Mai, Thailand",
                "userId": 3,
                "imageId": 1,
                "image": {
                    "id": 1,
                    "path": "1728239317254-Scan_20220113 (2).png",
                    "timestamp": "2024-10-10T01:15:14.000Z",
                    "updatedBy": 8
                }
            }
        }
    ]
};

export const startPatrolMock = {
    "id": 10,
    "date": "2025-01-11T17:00:00.000Z",
    "startTime": "2025-01-12T13:58:52.709Z",
    "endTime": null,
    "duration": null,
    "status": "on_going",
    "presetId": 3,
    "preset": {
        "id": 3,
        "title": "Monthly Safety Check",
        "description": "การตรวจสอบความปลอดภัยในโซนสำคัญประจำเดือน รวมถึงอุปกรณ์รักษาความปลอดภัยและความพร้อมของระบบรักษาความปลอดภัยต่าง ๆ"
    },
    "patrolChecklists": [
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
    ],
    "results": [
        {
            "id": 36,
            "status": null,
            "itemId": 2,
            "zoneId": 2,
            "patrolId": 10,
            "defects": [],
            "comments": []
        },
        {
            "id": 37,
            "status": null,
            "itemId": 2,
            "zoneId": 3,
            "patrolId": 10,
            "defects": [],
            "comments": []
        },
        {
            "id": 38,
            "status": null,
            "itemId": 3,
            "zoneId": 3,
            "patrolId": 10,
            "defects": [],
            "comments": []
        },
        {
            "id": 39,
            "status": null,
            "itemId": 3,
            "zoneId": 6,
            "patrolId": 10,
            "defects": [],
            "comments": []
        },
        {
            "id": 40,
            "status": null,
            "itemId": 4,
            "zoneId": 4,
            "patrolId": 10,
            "defects": [],
            "comments": []
        },
        {
            "id": 41,
            "status": null,
            "itemId": 4,
            "zoneId": 6,
            "patrolId": 10,
            "defects": [],
            "comments": []
        },
        {
            "id": 42,
            "status": null,
            "itemId": 10,
            "zoneId": 2,
            "patrolId": 10,
            "defects": [],
            "comments": []
        },
        {
            "id": 43,
            "status": null,
            "itemId": 10,
            "zoneId": 3,
            "patrolId": 10,
            "defects": [],
            "comments": []
        },
        {
            "id": 44,
            "status": null,
            "itemId": 10,
            "zoneId": 4,
            "patrolId": 10,
            "defects": [],
            "comments": []
        },
        {
            "id": 45,
            "status": null,
            "itemId": 11,
            "zoneId": 4,
            "patrolId": 10,
            "defects": [],
            "comments": []
        },
        {
            "id": 46,
            "status": null,
            "itemId": 11,
            "zoneId": 5,
            "patrolId": 10,
            "defects": [],
            "comments": []
        }
    ]
};

export const finishPatrolMock = {
    "id": 11,
    "date": "2025-01-11T17:00:00.000Z",
    "startTime": "2025-01-12T15:09:40.132Z",
    "endTime": "2025-01-12T15:14:55.207Z",
    "duration": "0h 5m 15s",
    "status": "completed",
    "presetId": 2,
    "preset": {
        "id": 2,
        "title": "Weekly Maintenance",
        "description": "ตรวจสอบบำรุงรักษาเครื่องจักรและอุปกรณ์ประจำสัปดาห์ เพื่อให้แน่ใจว่าอุปกรณ์ทุกอย่างทำงานอย่างมีประสิทธิภาพ"
    },
    "patrolChecklists": [
        {
            "id": 21,
            "patrolId": 11,
            "checklistId": 2,
            "userId": 3,
            "checklist": {
                "id": 2,
                "title": "Maintenance Inspection",
                "items": [
                    {
                        "id": 5,
                        "name": "Electrical Panel Inspection",
                        "type": "maintenance",
                        "checklistId": 2,
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
                    },
                    {
                        "id": 6,
                        "name": "Air Conditioning System Check",
                        "type": "maintenance",
                        "checklistId": 2,
                        "itemZones": [
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
                        "id": 7,
                        "name": "Lighting System Check",
                        "type": "maintenance",
                        "checklistId": 2,
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
                "username": "jameSmith",
                "email": null,
                "password": "$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm",
                "role": "inspector",
                "department": null,
                "createdAt": "2024-10-06T10:27:09.916Z",
                "active": true,
                "profile": {
                    "id": 3,
                    "name": "Jame Smith",
                    "age": 30,
                    "tel": "0987654321",
                    "address": "Chiang Mai, Thailand",
                    "userId": 3,
                    "imageId": 1,
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
            "id": 22,
            "patrolId": 11,
            "checklistId": 5,
            "userId": 3,
            "checklist": {
                "id": 5,
                "title": "Equipment Inspection",
                "items": [
                    {
                        "id": 12,
                        "name": "Server Equipment Inspection",
                        "type": "maintenance",
                        "checklistId": 5,
                        "itemZones": [
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
                    },
                    {
                        "id": 13,
                        "name": "Forklift Maintenance",
                        "type": "maintenance",
                        "checklistId": 5,
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
                            }
                        ]
                    }
                ]
            },
            "inspector": {
                "id": 3,
                "username": "jameSmith",
                "email": null,
                "password": "$2b$10$ie9w6UV.fquwZiKYYYbxhOmiGZl4KDC3cfMZDd0zk8IlEKY6R9ORm",
                "role": "inspector",
                "department": null,
                "createdAt": "2024-10-06T10:27:09.916Z",
                "active": true,
                "profile": {
                    "id": 3,
                    "name": "Jame Smith",
                    "age": 30,
                    "tel": "0987654321",
                    "address": "Chiang Mai, Thailand",
                    "userId": 3,
                    "imageId": 1,
                    "image": {
                        "id": 1,
                        "path": "1728239317254-Scan_20220113 (2).png",
                        "timestamp": "2024-10-10T01:15:14.000Z",
                        "updatedBy": 8
                    }
                }
            }
        }
    ],
    "results": [
        {
            "id": 47,
            "status": null,
            "itemId": 5,
            "zoneId": 2,
            "patrolId": 11,
            "defects": [],
            "comments": []
        },
        {
            "id": 48,
            "status": null,
            "itemId": 5,
            "zoneId": 5,
            "patrolId": 11,
            "defects": [],
            "comments": []
        },
        {
            "id": 49,
            "status": null,
            "itemId": 6,
            "zoneId": 5,
            "patrolId": 11,
            "defects": [],
            "comments": []
        },
        {
            "id": 50,
            "status": null,
            "itemId": 6,
            "zoneId": 6,
            "patrolId": 11,
            "defects": [],
            "comments": []
        },
        {
            "id": 51,
            "status": null,
            "itemId": 7,
            "zoneId": 2,
            "patrolId": 11,
            "defects": [],
            "comments": []
        },
        {
            "id": 52,
            "status": null,
            "itemId": 7,
            "zoneId": 6,
            "patrolId": 11,
            "defects": [],
            "comments": []
        },
        {
            "id": 53,
            "status": null,
            "itemId": 12,
            "zoneId": 5,
            "patrolId": 11,
            "defects": [],
            "comments": []
        },
        {
            "id": 54,
            "status": null,
            "itemId": 13,
            "zoneId": 3,
            "patrolId": 11,
            "defects": [],
            "comments": []
        }
    ]
};

export const patrolDefectsMock = {
    "patrol": {
        "id": 9,
        "date": "2025-01-11T17:00:00.000Z",
        "startTime": "2025-01-12T13:58:29.746Z",
        "endTime": null,
        "duration": null,
        "status": "on_going",
        "presetId": 1,
        "patrolChecklists": [
            {
                "id": 17,
                "patrolId": 9,
                "checklistId": 3,
                "userId": 3,
                "checklist": {
                    "id": 3,
                    "title": "Cleanliness Inspection",
                    "items": [
                        {
                            "id": 8,
                            "name": "Floor Cleanliness Check",
                            "type": "environment",
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
                            "type": "environment",
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
                            "timestamp": "2024-10-10T01:15:14.000Z",
                            "updatedBy": 8
                        }
                    }
                }
            },
            {
                "id": 18,
                "patrolId": 9,
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
    "defects": [
        {
            "id": 1,
            "name": "Floor Cleanliness Check",
            "description": "Test Defect",
            "type": "environment",
            "status": "reported",
            "startTime": "2025-01-12T15:26:41.005Z",
            "endTime": "2025-01-12T15:26:41.007Z",
            "userId": 3,
            "patrolResultId": 17,
            "patrolResult": {
                "zoneId": 4,
                "itemZone": {
                    "zone": {
                        "name": "quality_control_zone",
                        "supervisor": {
                            "id": 6,
                            "profile": {
                                "id": 6,
                                "name": "David Wilson",
                                "age": 29,
                                "tel": "5566778899",
                                "address": "Hat Yai, Thailand",
                                "userId": 6,
                                "imageId": null,
                                "image": null
                            }
                        }
                    }
                }
            },
            "images": [
                {
                    "image": {
                        "id": 2,
                        "path": "1736695600993-Screenshot_idp1st_takumi_fujiwara_ae86_trueno_pk_akina_21-7-124-18-35-49.jpg",
                        "user": {
                            "id": 3,
                            "email": null,
                            "role": "inspector",
                            "department": null,
                            "createdAt": "2024-10-06T10:27:09.916Z"
                        }
                    }
                }
            ]
        },
        {
            "id": 2,
            "name": "Floor Cleanliness Check",
            "description": "Test Defect 2",
            "type": "environment",
            "status": "reported",
            "startTime": "2025-01-12T15:26:58.602Z",
            "endTime": "2025-01-12T15:26:58.603Z",
            "userId": 3,
            "patrolResultId": 17,
            "patrolResult": {
                "zoneId": 4,
                "itemZone": {
                    "zone": {
                        "name": "quality_control_zone",
                        "supervisor": {
                            "id": 6,
                            "profile": {
                                "id": 6,
                                "name": "David Wilson",
                                "age": 29,
                                "tel": "5566778899",
                                "address": "Hat Yai, Thailand",
                                "userId": 6,
                                "imageId": null,
                                "image": null
                            }
                        }
                    }
                }
            },
            "images": [
                {
                    "image": {
                        "id": 3,
                        "path": "1736695618585-Screenshot_urd_darche_cup_2021_hanoi_street_circuit_31-7-124-4-32-38.jpg",
                        "user": {
                            "id": 3,
                            "email": null,
                            "role": "inspector",
                            "department": null,
                            "createdAt": "2024-10-06T10:27:09.916Z"
                        }
                    }
                }
            ]
        }
    ]
};

export const patrolCommentsMock = {
    "patrol": {
        "id": 9,
        "date": "2025-01-11T17:00:00.000Z",
        "startTime": "2025-01-12T13:58:29.746Z",
        "endTime": null,
        "duration": null,
        "status": "on_going",
        "presetId": 1,
        "patrolChecklists": [
            {
                "id": 17,
                "patrolId": 9,
                "checklistId": 3,
                "userId": 3,
                "checklist": {
                    "id": 3,
                    "title": "Cleanliness Inspection",
                    "items": [
                        {
                            "id": 8,
                            "name": "Floor Cleanliness Check",
                            "type": "environment",
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
                            "type": "environment",
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
                            "timestamp": "2024-10-10T01:15:14.000Z",
                            "updatedBy": 8
                        }
                    }
                }
            },
            {
                "id": 18,
                "patrolId": 9,
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
    "comment": {
        "id": 1,
        "message": "Test Comment",
        "timestamp": "2025-01-12T15:33:25.559Z",
        "status": false,
        "userId": 3,
        "patrolResultId": 17,
        "user": {
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
    }
};