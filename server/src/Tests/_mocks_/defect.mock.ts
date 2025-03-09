import { Readable } from "stream";

export const defectMock = {
    "patrol": {
        "id": 9,
        "date": "2025-01-11T17:00:00.000Z",
        "startTime": "2025-01-12T13:58:29.746Z",
        "endTime": null,
        "duration": null,
        "status": "on_going",
        "presetId": 1,
        "preset": {
            "id": 1,
            "title": "Daily Cleanliness Check",
            "description": "การตรวจสอบความสะอาดและความปลอดภัยในพื้นที่ทำงานประจำวัน โดยเฉพาะการดูแลพื้นและความสะอาดของพื้นที่ต้อนรับ"
        },
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
        ],
    },
    "defect": {
        "id": 1,
        "name": "Floor Cleanliness Check",
        "description": "Test Defect",
        "type": "environment",
        "status": "reported",
        "startTime": "2025-01-12T15:26:41.005Z",
        "endTime": "2025-01-12T15:26:41.007Z",
        "userId": 3,
        "patrolResultId": 17,
        "images": [
            {
                "defectId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "1736695600993-Screenshot_idp1st_takumi_fujiwara_ae86_trueno_pk_akina_21-7-124-18-35-49.jpg",
                    "timestamp": "2025-01-12T15:26:41.011Z",
                    "updatedBy": 3,
                    "user": {
                        "id": 3,
                        "role": "inspector",
                        "email": null,
                        "createdAt": "2024-10-06T10:27:09.916Z",
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
            }
        ],
        "patrolResult": {
            "itemZone": {
                "zone": {
                    "id": 4,
                    "name": "quality_control_zone",
                    "locationId": 1,
                    "userId": 6,
                    "supervisor": {
                        "profile": {
                            "id": 6,
                            "name": "David Wilson",
                            "age": 29,
                            "tel": "5566778899",
                            "address": "Hat Yai, Thailand",
                            "userId": 6,
                            "imageId": null
                        }
                    }
                }
            }
        }
    },
    "patrolResult": {
        "id": 17,
        "status": false,
        "itemId": 8,
        "zoneId": 4,
        "patrolId": 9,
    }
}

export const fileMock: Express.Multer.File = {
    fieldname: "image",
    originalname: "test-image.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    destination: "uploads/",
    filename: "test-image.jpg",
    path: "uploads/test-image.jpg",
    size: 1024,
    buffer: Buffer.from(""),
    stream: new Readable(),
};

export const allDefects = [
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
                    "id": 4,
                    "name": "quality_control_zone",
                    "locationId": 1,
                    "userId": 6
                }
            }
        },
        "user": {
            "id": 3,
            "role": "inspector",
            "email": null,
            "createdAt": "2024-10-06T10:27:09.916Z",
            "profile": {
                "id": 3,
                "name": "Jame Smith",
                "tel": "0987654321",
                "image": {
                    "id": 1,
                    "path": "1728239317254-Scan_20220113 (2).png",
                    "timestamp": "2024-10-10T01:15:14.000Z",
                    "updatedBy": 8
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
                        "role": "inspector",
                        "email": null,
                        "createdAt": "2024-10-06T10:27:09.916Z",
                        "profile": {
                            "id": 3,
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
                    "id": 4,
                    "name": "quality_control_zone",
                    "locationId": 1,
                    "userId": 6
                }
            }
        },
        "user": {
            "id": 3,
            "role": "inspector",
            "email": null,
            "createdAt": "2024-10-06T10:27:09.916Z",
            "profile": {
                "id": 3,
                "name": "Jame Smith",
                "tel": "0987654321",
                "image": {
                    "id": 1,
                    "path": "1728239317254-Scan_20220113 (2).png",
                    "timestamp": "2024-10-10T01:15:14.000Z",
                    "updatedBy": 8
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
                        "role": "inspector",
                        "email": null,
                        "createdAt": "2024-10-06T10:27:09.916Z",
                        "profile": {
                            "id": 3,
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
                }
            }
        ]
    }
];

export const updateDefectMock = {
    "id": 1,
    "name": "Floor Cleanliness Check",
    "description": "Test Defect Edit",
    "type": "environment",
    "status": "reported",
    "startTime": "2025-01-12T15:26:41.005Z",
    "endTime": "2025-01-12T15:26:41.007Z",
    "userId": 3,
    "patrolResultId": 17,
    "images": [
        {
            "defectId": 1,
            "imageId": 2,
            "image": {
                "id": 2,
                "path": "1736695600993-Screenshot_idp1st_takumi_fujiwara_ae86_trueno_pk_akina_21-7-124-18-35-49.jpg",
                "timestamp": "2025-01-12T15:26:41.011Z",
                "updatedBy": 3,
                "user": {
                    "id": 3,
                    "role": "inspector",
                    "email": null,
                    "createdAt": "2024-10-06T10:27:09.916Z",
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
        }
    ],
    "patrolResult": {
        "itemZone": {
            "zone": {
                "id": 4,
                "name": "quality_control_zone",
                "locationId": 1,
                "userId": 6,
                "supervisor": {
                    "profile": {
                        "id": 6,
                        "name": "David Wilson",
                        "age": 29,
                        "tel": "5566778899",
                        "address": "Hat Yai, Thailand",
                        "userId": 6,
                        "imageId": null
                    }
                }
            }
        }
    }
};

export const getAllCommentsMock = [
    {
        "id": 1,
        "message": "Test Comment",
        "timestamp": "2025-01-12T15:33:25.559Z",
        "status": false,
        "userId": 3,
        "patrolResultId": 17,
        "patrolResult": {
            "zoneId": 4,
            "itemZone": {
                "zone": {
                    "id": 4,
                    "name": "quality_control_zone",
                    "locationId": 1,
                    "userId": 6
                },
                "item": {
                    "id": 8,
                    "name": "Floor Cleanliness Check",
                    "type": "environment",
                    "checklistId": 3,
                    "checklist": {
                        "id": 3,
                        "title": "Cleanliness Inspection",
                        "version": 1,
                        "latest": true,
                        "updatedAt": "2024-10-06T10:05:15.000Z",
                        "updatedBy": 1
                    }
                }
            }
        },
        "user": {
            "id": 3,
            "role": "inspector",
            "email": null,
            "createdAt": "2024-10-06T10:27:09.916Z",
            "profile": {
                "id": 3,
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
    }
];

export const commentMock = {
    "id": 1,
    "message": "Test Comment",
    "timestamp": "2025-01-12T15:33:25.559Z",
    "status": true,
    "userId": 3,
    "patrolResultId": 17,
    "patrolResult": {
        "zoneId": 4,
        "itemZone": {
            "zone": {
                "id": 4,
                "name": "quality_control_zone",
                "locationId": 1,
                "userId": 6
            },
            "item": {
                "id": 8,
                "name": "Floor Cleanliness Check",
                "type": "environment",
                "checklistId": 3,
                "checklist": {
                    "id": 3,
                    "title": "Cleanliness Inspection",
                    "version": 1,
                    "latest": true,
                    "updatedAt": "2024-10-06T10:05:15.000Z",
                    "updatedBy": 1
                }
            }
        }
    },
    "user": {
        "id": 3,
        "role": "inspector",
        "email": null,
        "createdAt": "2024-10-06T10:27:09.916Z",
        "profile": {
            "id": 3,
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
};