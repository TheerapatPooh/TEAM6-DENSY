export const presetMock = {
    "id": 1,
    "title": "Daily Cleanliness Check",
    "description": "การตรวจสอบความสะอาดและความปลอดภัยในพื้นที่ทำงานประจำวัน โดยเฉพาะการดูแลพื้นและความสะอาดของพื้นที่ต้อนรับ",
    "presetChecklists": [
        {
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
            }
        },
        {
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
            }
        }
    ]
}

export const allPresetsMock =
    [
        {
            "id": 1,
            "title": "Daily Cleanliness Check",
            "description": "การตรวจสอบความสะอาดและความปลอดภัยในพื้นที่ทำงานประจำวัน โดยเฉพาะการดูแลพื้นและความสะอาดของพื้นที่ต้อนรับ",
            "version": 1,
            "latest": true,
            "updatedAt": "2024-10-06T10:16:12.000Z",
            "updatedBy": 1,
            "presetChecklists": [
                {
                    "presetId": 1,
                    "checklistId": 3,
                    "checklist": {
                        "id": 3,
                        "title": "Cleanliness Inspection",
                        "version": 1,
                        "latest": true,
                        "updatedAt": "2024-10-06T10:05:15.000Z",
                        "updatedBy": 1,
                        "items": [
                            {
                                "id": 8,
                                "name": "Floor Cleanliness Check",
                                "type": "environment",
                                "checklistId": 3,
                                "itemZones": [
                                    {
                                        "itemId": 8,
                                        "zoneId": 4,
                                        "zone": {
                                            "id": 4,
                                            "name": "quality_control_zone",
                                            "locationId": 1,
                                            "userId": 6
                                        }
                                    },
                                    {
                                        "itemId": 8,
                                        "zoneId": 6,
                                        "zone": {
                                            "id": 6,
                                            "name": "customer_service_zone",
                                            "locationId": 1,
                                            "userId": 8
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
                                        "itemId": 9,
                                        "zoneId": 6,
                                        "zone": {
                                            "id": 6,
                                            "name": "customer_service_zone",
                                            "locationId": 1,
                                            "userId": 8
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "presetId": 1,
                    "checklistId": 4,
                    "checklist": {
                        "id": 4,
                        "title": "Security Inspection",
                        "version": 1,
                        "latest": true,
                        "updatedAt": "2024-10-06T10:05:25.000Z",
                        "updatedBy": 1,
                        "items": [
                            {
                                "id": 10,
                                "name": "CCTV Functionality Check",
                                "type": "safety",
                                "checklistId": 4,
                                "itemZones": [
                                    {
                                        "itemId": 10,
                                        "zoneId": 2,
                                        "zone": {
                                            "id": 2,
                                            "name": "assembly_line_zone",
                                            "locationId": 1,
                                            "userId": 4
                                        }
                                    },
                                    {
                                        "itemId": 10,
                                        "zoneId": 3,
                                        "zone": {
                                            "id": 3,
                                            "name": "raw_materials_storage_zone",
                                            "locationId": 1,
                                            "userId": 5
                                        }
                                    },
                                    {
                                        "itemId": 10,
                                        "zoneId": 4,
                                        "zone": {
                                            "id": 4,
                                            "name": "quality_control_zone",
                                            "locationId": 1,
                                            "userId": 6
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
                                        "itemId": 11,
                                        "zoneId": 4,
                                        "zone": {
                                            "id": 4,
                                            "name": "quality_control_zone",
                                            "locationId": 1,
                                            "userId": 6
                                        }
                                    },
                                    {
                                        "itemId": 11,
                                        "zoneId": 5,
                                        "zone": {
                                            "id": 5,
                                            "name": "it_zone",
                                            "locationId": 1,
                                            "userId": 7
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ],
            "user": {
                "id": 1,
                "username": "admin",
                "profile": {
                    "name": "Admin Mhee",
                    "image": null
                }
            }
        },
        {
            "id": 2,
            "title": "Weekly Maintenance",
            "description": "ตรวจสอบบำรุงรักษาเครื่องจักรและอุปกรณ์ประจำสัปดาห์ เพื่อให้แน่ใจว่าอุปกรณ์ทุกอย่างทำงานอย่างมีประสิทธิภาพ",
            "version": 1,
            "latest": true,
            "updatedAt": "2024-10-06T10:17:46.000Z",
            "updatedBy": 1,
            "presetChecklists": [
                {
                    "presetId": 2,
                    "checklistId": 2,
                    "checklist": {
                        "id": 2,
                        "title": "Maintenance Inspection",
                        "version": 1,
                        "latest": true,
                        "updatedAt": "2024-10-06T10:05:10.000Z",
                        "updatedBy": 1,
                        "items": [
                            {
                                "id": 5,
                                "name": "Electrical Panel Inspection",
                                "type": "maintenance",
                                "checklistId": 2,
                                "itemZones": [
                                    {
                                        "itemId": 5,
                                        "zoneId": 2,
                                        "zone": {
                                            "id": 2,
                                            "name": "assembly_line_zone",
                                            "locationId": 1,
                                            "userId": 4
                                        }
                                    },
                                    {
                                        "itemId": 5,
                                        "zoneId": 5,
                                        "zone": {
                                            "id": 5,
                                            "name": "it_zone",
                                            "locationId": 1,
                                            "userId": 7
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
                                        "itemId": 6,
                                        "zoneId": 5,
                                        "zone": {
                                            "id": 5,
                                            "name": "it_zone",
                                            "locationId": 1,
                                            "userId": 7
                                        }
                                    },
                                    {
                                        "itemId": 6,
                                        "zoneId": 6,
                                        "zone": {
                                            "id": 6,
                                            "name": "customer_service_zone",
                                            "locationId": 1,
                                            "userId": 8
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
                                        "itemId": 7,
                                        "zoneId": 2,
                                        "zone": {
                                            "id": 2,
                                            "name": "assembly_line_zone",
                                            "locationId": 1,
                                            "userId": 4
                                        }
                                    },
                                    {
                                        "itemId": 7,
                                        "zoneId": 6,
                                        "zone": {
                                            "id": 6,
                                            "name": "customer_service_zone",
                                            "locationId": 1,
                                            "userId": 8
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "presetId": 2,
                    "checklistId": 5,
                    "checklist": {
                        "id": 5,
                        "title": "Equipment Inspection",
                        "version": 1,
                        "latest": true,
                        "updatedAt": "2024-10-06T10:05:43.000Z",
                        "updatedBy": 1,
                        "items": [
                            {
                                "id": 12,
                                "name": "Server Equipment Inspection",
                                "type": "maintenance",
                                "checklistId": 5,
                                "itemZones": [
                                    {
                                        "itemId": 12,
                                        "zoneId": 5,
                                        "zone": {
                                            "id": 5,
                                            "name": "it_zone",
                                            "locationId": 1,
                                            "userId": 7
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
                                        "itemId": 13,
                                        "zoneId": 3,
                                        "zone": {
                                            "id": 3,
                                            "name": "raw_materials_storage_zone",
                                            "locationId": 1,
                                            "userId": 5
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ],
            "user": {
                "id": 1,
                "username": "admin",
                "profile": {
                    "name": "Admin Mhee",
                    "image": null
                }
            }
        },
        {
            "id": 3,
            "title": "Monthly Safety Check",
            "description": "การตรวจสอบความปลอดภัยในโซนสำคัญประจำเดือน รวมถึงอุปกรณ์รักษาความปลอดภัยและความพร้อมของระบบรักษาความปลอดภัยต่าง ๆ",
            "version": 1,
            "latest": true,
            "updatedAt": "2024-10-06T10:18:04.000Z",
            "updatedBy": 1,
            "presetChecklists": [
                {
                    "presetId": 3,
                    "checklistId": 1,
                    "checklist": {
                        "id": 1,
                        "title": "Safety Inspection",
                        "version": 1,
                        "latest": true,
                        "updatedAt": "2024-10-06T10:05:09.000Z",
                        "updatedBy": 1,
                        "items": [
                            {
                                "id": 2,
                                "name": "Fire Extinguisher Check",
                                "type": "safety",
                                "checklistId": 1,
                                "itemZones": [
                                    {
                                        "itemId": 2,
                                        "zoneId": 2,
                                        "zone": {
                                            "id": 2,
                                            "name": "assembly_line_zone",
                                            "locationId": 1,
                                            "userId": 4
                                        }
                                    },
                                    {
                                        "itemId": 2,
                                        "zoneId": 3,
                                        "zone": {
                                            "id": 3,
                                            "name": "raw_materials_storage_zone",
                                            "locationId": 1,
                                            "userId": 5
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
                                        "itemId": 3,
                                        "zoneId": 3,
                                        "zone": {
                                            "id": 3,
                                            "name": "raw_materials_storage_zone",
                                            "locationId": 1,
                                            "userId": 5
                                        }
                                    },
                                    {
                                        "itemId": 3,
                                        "zoneId": 6,
                                        "zone": {
                                            "id": 6,
                                            "name": "customer_service_zone",
                                            "locationId": 1,
                                            "userId": 8
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
                                        "itemId": 4,
                                        "zoneId": 4,
                                        "zone": {
                                            "id": 4,
                                            "name": "quality_control_zone",
                                            "locationId": 1,
                                            "userId": 6
                                        }
                                    },
                                    {
                                        "itemId": 4,
                                        "zoneId": 6,
                                        "zone": {
                                            "id": 6,
                                            "name": "customer_service_zone",
                                            "locationId": 1,
                                            "userId": 8
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "presetId": 3,
                    "checklistId": 4,
                    "checklist": {
                        "id": 4,
                        "title": "Security Inspection",
                        "version": 1,
                        "latest": true,
                        "updatedAt": "2024-10-06T10:05:25.000Z",
                        "updatedBy": 1,
                        "items": [
                            {
                                "id": 10,
                                "name": "CCTV Functionality Check",
                                "type": "safety",
                                "checklistId": 4,
                                "itemZones": [
                                    {
                                        "itemId": 10,
                                        "zoneId": 2,
                                        "zone": {
                                            "id": 2,
                                            "name": "assembly_line_zone",
                                            "locationId": 1,
                                            "userId": 4
                                        }
                                    },
                                    {
                                        "itemId": 10,
                                        "zoneId": 3,
                                        "zone": {
                                            "id": 3,
                                            "name": "raw_materials_storage_zone",
                                            "locationId": 1,
                                            "userId": 5
                                        }
                                    },
                                    {
                                        "itemId": 10,
                                        "zoneId": 4,
                                        "zone": {
                                            "id": 4,
                                            "name": "quality_control_zone",
                                            "locationId": 1,
                                            "userId": 6
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
                                        "itemId": 11,
                                        "zoneId": 4,
                                        "zone": {
                                            "id": 4,
                                            "name": "quality_control_zone",
                                            "locationId": 1,
                                            "userId": 6
                                        }
                                    },
                                    {
                                        "itemId": 11,
                                        "zoneId": 5,
                                        "zone": {
                                            "id": 5,
                                            "name": "it_zone",
                                            "locationId": 1,
                                            "userId": 7
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ],
            "user": {
                "id": 1,
                "username": "admin",
                "profile": {
                    "name": "Admin Mhee",
                    "image": null
                }
            }
        },
        {
            "id": 4,
            "title": "Quarterly Full Inspection",
            "description": "การตรวจสอบเต็มรูปแบบทุก 3 เดือน รวมถึงความปลอดภัย การบำรุงรักษาอุปกรณ์ และความสะอาดของพื้นที่ทั้งหมด",
            "version": 1,
            "latest": true,
            "updatedAt": "2024-10-06T10:18:22.000Z",
            "updatedBy": 1,
            "presetChecklists": [
                {
                    "presetId": 4,
                    "checklistId": 1,
                    "checklist": {
                        "id": 1,
                        "title": "Safety Inspection",
                        "version": 1,
                        "latest": true,
                        "updatedAt": "2024-10-06T10:05:09.000Z",
                        "updatedBy": 1,
                        "items": [
                            {
                                "id": 2,
                                "name": "Fire Extinguisher Check",
                                "type": "safety",
                                "checklistId": 1,
                                "itemZones": [
                                    {
                                        "itemId": 2,
                                        "zoneId": 2,
                                        "zone": {
                                            "id": 2,
                                            "name": "assembly_line_zone",
                                            "locationId": 1,
                                            "userId": 4
                                        }
                                    },
                                    {
                                        "itemId": 2,
                                        "zoneId": 3,
                                        "zone": {
                                            "id": 3,
                                            "name": "raw_materials_storage_zone",
                                            "locationId": 1,
                                            "userId": 5
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
                                        "itemId": 3,
                                        "zoneId": 3,
                                        "zone": {
                                            "id": 3,
                                            "name": "raw_materials_storage_zone",
                                            "locationId": 1,
                                            "userId": 5
                                        }
                                    },
                                    {
                                        "itemId": 3,
                                        "zoneId": 6,
                                        "zone": {
                                            "id": 6,
                                            "name": "customer_service_zone",
                                            "locationId": 1,
                                            "userId": 8
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
                                        "itemId": 4,
                                        "zoneId": 4,
                                        "zone": {
                                            "id": 4,
                                            "name": "quality_control_zone",
                                            "locationId": 1,
                                            "userId": 6
                                        }
                                    },
                                    {
                                        "itemId": 4,
                                        "zoneId": 6,
                                        "zone": {
                                            "id": 6,
                                            "name": "customer_service_zone",
                                            "locationId": 1,
                                            "userId": 8
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "presetId": 4,
                    "checklistId": 2,
                    "checklist": {
                        "id": 2,
                        "title": "Maintenance Inspection",
                        "version": 1,
                        "latest": true,
                        "updatedAt": "2024-10-06T10:05:10.000Z",
                        "updatedBy": 1,
                        "items": [
                            {
                                "id": 5,
                                "name": "Electrical Panel Inspection",
                                "type": "maintenance",
                                "checklistId": 2,
                                "itemZones": [
                                    {
                                        "itemId": 5,
                                        "zoneId": 2,
                                        "zone": {
                                            "id": 2,
                                            "name": "assembly_line_zone",
                                            "locationId": 1,
                                            "userId": 4
                                        }
                                    },
                                    {
                                        "itemId": 5,
                                        "zoneId": 5,
                                        "zone": {
                                            "id": 5,
                                            "name": "it_zone",
                                            "locationId": 1,
                                            "userId": 7
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
                                        "itemId": 6,
                                        "zoneId": 5,
                                        "zone": {
                                            "id": 5,
                                            "name": "it_zone",
                                            "locationId": 1,
                                            "userId": 7
                                        }
                                    },
                                    {
                                        "itemId": 6,
                                        "zoneId": 6,
                                        "zone": {
                                            "id": 6,
                                            "name": "customer_service_zone",
                                            "locationId": 1,
                                            "userId": 8
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
                                        "itemId": 7,
                                        "zoneId": 2,
                                        "zone": {
                                            "id": 2,
                                            "name": "assembly_line_zone",
                                            "locationId": 1,
                                            "userId": 4
                                        }
                                    },
                                    {
                                        "itemId": 7,
                                        "zoneId": 6,
                                        "zone": {
                                            "id": 6,
                                            "name": "customer_service_zone",
                                            "locationId": 1,
                                            "userId": 8
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "presetId": 4,
                    "checklistId": 3,
                    "checklist": {
                        "id": 3,
                        "title": "Cleanliness Inspection",
                        "version": 1,
                        "latest": true,
                        "updatedAt": "2024-10-06T10:05:15.000Z",
                        "updatedBy": 1,
                        "items": [
                            {
                                "id": 8,
                                "name": "Floor Cleanliness Check",
                                "type": "environment",
                                "checklistId": 3,
                                "itemZones": [
                                    {
                                        "itemId": 8,
                                        "zoneId": 4,
                                        "zone": {
                                            "id": 4,
                                            "name": "quality_control_zone",
                                            "locationId": 1,
                                            "userId": 6
                                        }
                                    },
                                    {
                                        "itemId": 8,
                                        "zoneId": 6,
                                        "zone": {
                                            "id": 6,
                                            "name": "customer_service_zone",
                                            "locationId": 1,
                                            "userId": 8
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
                                        "itemId": 9,
                                        "zoneId": 6,
                                        "zone": {
                                            "id": 6,
                                            "name": "customer_service_zone",
                                            "locationId": 1,
                                            "userId": 8
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "presetId": 4,
                    "checklistId": 5,
                    "checklist": {
                        "id": 5,
                        "title": "Equipment Inspection",
                        "version": 1,
                        "latest": true,
                        "updatedAt": "2024-10-06T10:05:43.000Z",
                        "updatedBy": 1,
                        "items": [
                            {
                                "id": 12,
                                "name": "Server Equipment Inspection",
                                "type": "maintenance",
                                "checklistId": 5,
                                "itemZones": [
                                    {
                                        "itemId": 12,
                                        "zoneId": 5,
                                        "zone": {
                                            "id": 5,
                                            "name": "it_zone",
                                            "locationId": 1,
                                            "userId": 7
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
                                        "itemId": 13,
                                        "zoneId": 3,
                                        "zone": {
                                            "id": 3,
                                            "name": "raw_materials_storage_zone",
                                            "locationId": 1,
                                            "userId": 5
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ],
            "user": {
                "id": 1,
                "username": "admin",
                "profile": {
                    "name": "Admin Mhee",
                    "image": null
                }
            }
        }
    ]
export const allPresetsResponseMock = [
    {
        "id": 1,
        "title": "Daily Cleanliness Check",
        "description": "การตรวจสอบความสะอาดและความปลอดภัยในพื้นที่ทำงานประจำวัน โดยเฉพาะการดูแลพื้นและความสะอาดของพื้นที่ต้อนรับ",
        "version": 1,
        "updatedAt": "2024-10-06T10:16:12.000Z",
        "updateByUserName": "Admin Mhee",
        "updateByUserImagePath": "",
        "zones": [
            "quality_control_zone",
            "customer_service_zone",
            "assembly_line_zone",
            "raw_materials_storage_zone",
            "it_zone"
        ],
        "presetChecklists": [
            {
                "presetId": 1,
                "checklistId": 3,
                "checklist": {
                    "id": 3,
                    "title": "Cleanliness Inspection",
                    "version": 1,
                    "latest": true,
                    "updatedAt": "2024-10-06T10:05:15.000Z",
                    "updatedBy": 1,
                    "items": [
                        {
                            "id": 8,
                            "name": "Floor Cleanliness Check",
                            "type": "environment",
                            "checklistId": 3,
                            "itemZones": [
                                {
                                    "itemId": 8,
                                    "zoneId": 4,
                                    "zone": {
                                        "id": 4,
                                        "name": "quality_control_zone",
                                        "locationId": 1,
                                        "userId": 6
                                    }
                                },
                                {
                                    "itemId": 8,
                                    "zoneId": 6,
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone",
                                        "locationId": 1,
                                        "userId": 8
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
                                    "itemId": 9,
                                    "zoneId": 6,
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone",
                                        "locationId": 1,
                                        "userId": 8
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "presetId": 1,
                "checklistId": 4,
                "checklist": {
                    "id": 4,
                    "title": "Security Inspection",
                    "version": 1,
                    "latest": true,
                    "updatedAt": "2024-10-06T10:05:25.000Z",
                    "updatedBy": 1,
                    "items": [
                        {
                            "id": 10,
                            "name": "CCTV Functionality Check",
                            "type": "safety",
                            "checklistId": 4,
                            "itemZones": [
                                {
                                    "itemId": 10,
                                    "zoneId": 2,
                                    "zone": {
                                        "id": 2,
                                        "name": "assembly_line_zone",
                                        "locationId": 1,
                                        "userId": 4
                                    }
                                },
                                {
                                    "itemId": 10,
                                    "zoneId": 3,
                                    "zone": {
                                        "id": 3,
                                        "name": "raw_materials_storage_zone",
                                        "locationId": 1,
                                        "userId": 5
                                    }
                                },
                                {
                                    "itemId": 10,
                                    "zoneId": 4,
                                    "zone": {
                                        "id": 4,
                                        "name": "quality_control_zone",
                                        "locationId": 1,
                                        "userId": 6
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
                                    "itemId": 11,
                                    "zoneId": 4,
                                    "zone": {
                                        "id": 4,
                                        "name": "quality_control_zone",
                                        "locationId": 1,
                                        "userId": 6
                                    }
                                },
                                {
                                    "itemId": 11,
                                    "zoneId": 5,
                                    "zone": {
                                        "id": 5,
                                        "name": "it_zone",
                                        "locationId": 1,
                                        "userId": 7
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        "versionCount": 1
    },
    {
        "id": 2,
        "title": "Weekly Maintenance",
        "description": "ตรวจสอบบำรุงรักษาเครื่องจักรและอุปกรณ์ประจำสัปดาห์ เพื่อให้แน่ใจว่าอุปกรณ์ทุกอย่างทำงานอย่างมีประสิทธิภาพ",
        "version": 1,
        "updatedAt": "2024-10-06T10:17:46.000Z",
        "updateByUserName": "Admin Mhee",
        "updateByUserImagePath": "",
        "zones": [
            "assembly_line_zone",
            "it_zone",
            "customer_service_zone",
            "raw_materials_storage_zone"
        ],
        "presetChecklists": [
            {
                "presetId": 2,
                "checklistId": 2,
                "checklist": {
                    "id": 2,
                    "title": "Maintenance Inspection",
                    "version": 1,
                    "latest": true,
                    "updatedAt": "2024-10-06T10:05:10.000Z",
                    "updatedBy": 1,
                    "items": [
                        {
                            "id": 5,
                            "name": "Electrical Panel Inspection",
                            "type": "maintenance",
                            "checklistId": 2,
                            "itemZones": [
                                {
                                    "itemId": 5,
                                    "zoneId": 2,
                                    "zone": {
                                        "id": 2,
                                        "name": "assembly_line_zone",
                                        "locationId": 1,
                                        "userId": 4
                                    }
                                },
                                {
                                    "itemId": 5,
                                    "zoneId": 5,
                                    "zone": {
                                        "id": 5,
                                        "name": "it_zone",
                                        "locationId": 1,
                                        "userId": 7
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
                                    "itemId": 6,
                                    "zoneId": 5,
                                    "zone": {
                                        "id": 5,
                                        "name": "it_zone",
                                        "locationId": 1,
                                        "userId": 7
                                    }
                                },
                                {
                                    "itemId": 6,
                                    "zoneId": 6,
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone",
                                        "locationId": 1,
                                        "userId": 8
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
                                    "itemId": 7,
                                    "zoneId": 2,
                                    "zone": {
                                        "id": 2,
                                        "name": "assembly_line_zone",
                                        "locationId": 1,
                                        "userId": 4
                                    }
                                },
                                {
                                    "itemId": 7,
                                    "zoneId": 6,
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone",
                                        "locationId": 1,
                                        "userId": 8
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "presetId": 2,
                "checklistId": 5,
                "checklist": {
                    "id": 5,
                    "title": "Equipment Inspection",
                    "version": 1,
                    "latest": true,
                    "updatedAt": "2024-10-06T10:05:43.000Z",
                    "updatedBy": 1,
                    "items": [
                        {
                            "id": 12,
                            "name": "Server Equipment Inspection",
                            "type": "maintenance",
                            "checklistId": 5,
                            "itemZones": [
                                {
                                    "itemId": 12,
                                    "zoneId": 5,
                                    "zone": {
                                        "id": 5,
                                        "name": "it_zone",
                                        "locationId": 1,
                                        "userId": 7
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
                                    "itemId": 13,
                                    "zoneId": 3,
                                    "zone": {
                                        "id": 3,
                                        "name": "raw_materials_storage_zone",
                                        "locationId": 1,
                                        "userId": 5
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        "versionCount": 1
    },
    {
        "id": 3,
        "title": "Monthly Safety Check",
        "description": "การตรวจสอบความปลอดภัยในโซนสำคัญประจำเดือน รวมถึงอุปกรณ์รักษาความปลอดภัยและความพร้อมของระบบรักษาความปลอดภัยต่าง ๆ",
        "version": 1,
        "updatedAt": "2024-10-06T10:18:04.000Z",
        "updateByUserName": "Admin Mhee",
        "updateByUserImagePath": "",
        "zones": [
            "assembly_line_zone",
            "raw_materials_storage_zone",
            "customer_service_zone",
            "quality_control_zone",
            "it_zone"
        ],
        "presetChecklists": [
            {
                "presetId": 3,
                "checklistId": 1,
                "checklist": {
                    "id": 1,
                    "title": "Safety Inspection",
                    "version": 1,
                    "latest": true,
                    "updatedAt": "2024-10-06T10:05:09.000Z",
                    "updatedBy": 1,
                    "items": [
                        {
                            "id": 2,
                            "name": "Fire Extinguisher Check",
                            "type": "safety",
                            "checklistId": 1,
                            "itemZones": [
                                {
                                    "itemId": 2,
                                    "zoneId": 2,
                                    "zone": {
                                        "id": 2,
                                        "name": "assembly_line_zone",
                                        "locationId": 1,
                                        "userId": 4
                                    }
                                },
                                {
                                    "itemId": 2,
                                    "zoneId": 3,
                                    "zone": {
                                        "id": 3,
                                        "name": "raw_materials_storage_zone",
                                        "locationId": 1,
                                        "userId": 5
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
                                    "itemId": 3,
                                    "zoneId": 3,
                                    "zone": {
                                        "id": 3,
                                        "name": "raw_materials_storage_zone",
                                        "locationId": 1,
                                        "userId": 5
                                    }
                                },
                                {
                                    "itemId": 3,
                                    "zoneId": 6,
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone",
                                        "locationId": 1,
                                        "userId": 8
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
                                    "itemId": 4,
                                    "zoneId": 4,
                                    "zone": {
                                        "id": 4,
                                        "name": "quality_control_zone",
                                        "locationId": 1,
                                        "userId": 6
                                    }
                                },
                                {
                                    "itemId": 4,
                                    "zoneId": 6,
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone",
                                        "locationId": 1,
                                        "userId": 8
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "presetId": 3,
                "checklistId": 4,
                "checklist": {
                    "id": 4,
                    "title": "Security Inspection",
                    "version": 1,
                    "latest": true,
                    "updatedAt": "2024-10-06T10:05:25.000Z",
                    "updatedBy": 1,
                    "items": [
                        {
                            "id": 10,
                            "name": "CCTV Functionality Check",
                            "type": "safety",
                            "checklistId": 4,
                            "itemZones": [
                                {
                                    "itemId": 10,
                                    "zoneId": 2,
                                    "zone": {
                                        "id": 2,
                                        "name": "assembly_line_zone",
                                        "locationId": 1,
                                        "userId": 4
                                    }
                                },
                                {
                                    "itemId": 10,
                                    "zoneId": 3,
                                    "zone": {
                                        "id": 3,
                                        "name": "raw_materials_storage_zone",
                                        "locationId": 1,
                                        "userId": 5
                                    }
                                },
                                {
                                    "itemId": 10,
                                    "zoneId": 4,
                                    "zone": {
                                        "id": 4,
                                        "name": "quality_control_zone",
                                        "locationId": 1,
                                        "userId": 6
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
                                    "itemId": 11,
                                    "zoneId": 4,
                                    "zone": {
                                        "id": 4,
                                        "name": "quality_control_zone",
                                        "locationId": 1,
                                        "userId": 6
                                    }
                                },
                                {
                                    "itemId": 11,
                                    "zoneId": 5,
                                    "zone": {
                                        "id": 5,
                                        "name": "it_zone",
                                        "locationId": 1,
                                        "userId": 7
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        "versionCount": 1
    },
    {
        "id": 4,
        "title": "Quarterly Full Inspection",
        "description": "การตรวจสอบเต็มรูปแบบทุก 3 เดือน รวมถึงความปลอดภัย การบำรุงรักษาอุปกรณ์ และความสะอาดของพื้นที่ทั้งหมด",
        "version": 1,
        "updatedAt": "2024-10-06T10:18:22.000Z",
        "updateByUserName": "Admin Mhee",
        "updateByUserImagePath": "",
        "zones": [
            "assembly_line_zone",
            "raw_materials_storage_zone",
            "customer_service_zone",
            "quality_control_zone",
            "it_zone"
        ],
        "presetChecklists": [
            {
                "presetId": 4,
                "checklistId": 1,
                "checklist": {
                    "id": 1,
                    "title": "Safety Inspection",
                    "version": 1,
                    "latest": true,
                    "updatedAt": "2024-10-06T10:05:09.000Z",
                    "updatedBy": 1,
                    "items": [
                        {
                            "id": 2,
                            "name": "Fire Extinguisher Check",
                            "type": "safety",
                            "checklistId": 1,
                            "itemZones": [
                                {
                                    "itemId": 2,
                                    "zoneId": 2,
                                    "zone": {
                                        "id": 2,
                                        "name": "assembly_line_zone",
                                        "locationId": 1,
                                        "userId": 4
                                    }
                                },
                                {
                                    "itemId": 2,
                                    "zoneId": 3,
                                    "zone": {
                                        "id": 3,
                                        "name": "raw_materials_storage_zone",
                                        "locationId": 1,
                                        "userId": 5
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
                                    "itemId": 3,
                                    "zoneId": 3,
                                    "zone": {
                                        "id": 3,
                                        "name": "raw_materials_storage_zone",
                                        "locationId": 1,
                                        "userId": 5
                                    }
                                },
                                {
                                    "itemId": 3,
                                    "zoneId": 6,
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone",
                                        "locationId": 1,
                                        "userId": 8
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
                                    "itemId": 4,
                                    "zoneId": 4,
                                    "zone": {
                                        "id": 4,
                                        "name": "quality_control_zone",
                                        "locationId": 1,
                                        "userId": 6
                                    }
                                },
                                {
                                    "itemId": 4,
                                    "zoneId": 6,
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone",
                                        "locationId": 1,
                                        "userId": 8
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "presetId": 4,
                "checklistId": 2,
                "checklist": {
                    "id": 2,
                    "title": "Maintenance Inspection",
                    "version": 1,
                    "latest": true,
                    "updatedAt": "2024-10-06T10:05:10.000Z",
                    "updatedBy": 1,
                    "items": [
                        {
                            "id": 5,
                            "name": "Electrical Panel Inspection",
                            "type": "maintenance",
                            "checklistId": 2,
                            "itemZones": [
                                {
                                    "itemId": 5,
                                    "zoneId": 2,
                                    "zone": {
                                        "id": 2,
                                        "name": "assembly_line_zone",
                                        "locationId": 1,
                                        "userId": 4
                                    }
                                },
                                {
                                    "itemId": 5,
                                    "zoneId": 5,
                                    "zone": {
                                        "id": 5,
                                        "name": "it_zone",
                                        "locationId": 1,
                                        "userId": 7
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
                                    "itemId": 6,
                                    "zoneId": 5,
                                    "zone": {
                                        "id": 5,
                                        "name": "it_zone",
                                        "locationId": 1,
                                        "userId": 7
                                    }
                                },
                                {
                                    "itemId": 6,
                                    "zoneId": 6,
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone",
                                        "locationId": 1,
                                        "userId": 8
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
                                    "itemId": 7,
                                    "zoneId": 2,
                                    "zone": {
                                        "id": 2,
                                        "name": "assembly_line_zone",
                                        "locationId": 1,
                                        "userId": 4
                                    }
                                },
                                {
                                    "itemId": 7,
                                    "zoneId": 6,
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone",
                                        "locationId": 1,
                                        "userId": 8
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "presetId": 4,
                "checklistId": 3,
                "checklist": {
                    "id": 3,
                    "title": "Cleanliness Inspection",
                    "version": 1,
                    "latest": true,
                    "updatedAt": "2024-10-06T10:05:15.000Z",
                    "updatedBy": 1,
                    "items": [
                        {
                            "id": 8,
                            "name": "Floor Cleanliness Check",
                            "type": "environment",
                            "checklistId": 3,
                            "itemZones": [
                                {
                                    "itemId": 8,
                                    "zoneId": 4,
                                    "zone": {
                                        "id": 4,
                                        "name": "quality_control_zone",
                                        "locationId": 1,
                                        "userId": 6
                                    }
                                },
                                {
                                    "itemId": 8,
                                    "zoneId": 6,
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone",
                                        "locationId": 1,
                                        "userId": 8
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
                                    "itemId": 9,
                                    "zoneId": 6,
                                    "zone": {
                                        "id": 6,
                                        "name": "customer_service_zone",
                                        "locationId": 1,
                                        "userId": 8
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "presetId": 4,
                "checklistId": 5,
                "checklist": {
                    "id": 5,
                    "title": "Equipment Inspection",
                    "version": 1,
                    "latest": true,
                    "updatedAt": "2024-10-06T10:05:43.000Z",
                    "updatedBy": 1,
                    "items": [
                        {
                            "id": 12,
                            "name": "Server Equipment Inspection",
                            "type": "maintenance",
                            "checklistId": 5,
                            "itemZones": [
                                {
                                    "itemId": 12,
                                    "zoneId": 5,
                                    "zone": {
                                        "id": 5,
                                        "name": "it_zone",
                                        "locationId": 1,
                                        "userId": 7
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
                                    "itemId": 13,
                                    "zoneId": 3,
                                    "zone": {
                                        "id": 3,
                                        "name": "raw_materials_storage_zone",
                                        "locationId": 1,
                                        "userId": 5
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        "versionCount": 1
    }
]

export const checklistResponseMock = {
    "id": 1,
    "title": "Safety Inspection",
    "version": 1,
    "latest": true,
    "updatedAt": "2024-12-25T15:33:06.727Z",
    "updatedBy": 1,
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
                        "name": "assembly_line_zone"
                    }
                },
                {
                    "zone": {
                        "id": 3,
                        "name": "raw_materials_storage_zone"
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
                        "name": "raw_materials_storage_zone"
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
            "id": 4,
            "name": "First Aid Kit Check",
            "type": "safety",
            "checklistId": 1,
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
        }
    ]
}

export const allChecklistsMock = [
    {
        "id": 17,
        "title": "asdx",
        "version": 1,
        "latest": true,
        "updatedAt": "2024-12-25T14:58:26.454Z",
        "updatedBy": 1,
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "items": [
            {
                "id": 24,
                "name": "asdf",
                "type": "maintenance",
                "checklistId": 17,
                "itemZones": [
                    {
                        "zone": {
                            "name": "r&d_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 3,
                                    "name": "Jame Smith",
                                    "age": null,
                                    "tel": "0987654321",
                                    "address": "Chiang Mai, Thailand",
                                    "userId": 3,
                                    "imageId": 1
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": 22,
        "title": "12xdasd",
        "version": 1,
        "latest": true,
        "updatedAt": "2025-01-06T21:40:10.607Z",
        "updatedBy": 1,
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "items": [
            {
                "id": 33,
                "name": "asedfq",
                "type": "safety",
                "checklistId": 22,
                "itemZones": [
                    {
                        "zone": {
                            "name": "training_simulation_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 18,
                                    "name": "Brian King",
                                    "age": 36,
                                    "tel": "2211009988",
                                    "address": "Nakhon Sawan, Thailand",
                                    "userId": 18,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            },
            {
                "id": 34,
                "name": "124zxc",
                "type": "environment",
                "checklistId": 22,
                "itemZones": [
                    {
                        "zone": {
                            "name": "assembly_line_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 4,
                                    "name": "Michael Johnson",
                                    "age": 28,
                                    "tel": "1122334455",
                                    "address": "Phuket, Thailand",
                                    "userId": 4,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "raw_materials_storage_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 5,
                                    "name": "Emily Davis",
                                    "age": 32,
                                    "tel": "6677889900",
                                    "address": "Pattaya, Thailand",
                                    "userId": 5,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "training_simulation_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 18,
                                    "name": "Brian King",
                                    "age": 36,
                                    "tel": "2211009988",
                                    "address": "Nakhon Sawan, Thailand",
                                    "userId": 18,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            },
            {
                "id": 35,
                "name": "1sdfxz",
                "type": "maintenance",
                "checklistId": 22,
                "itemZones": [
                    {
                        "zone": {
                            "name": "maintenance_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 12,
                                    "name": "Steven Wright",
                                    "age": 24,
                                    "tel": "8877665544",
                                    "address": "Sakon Nakhon, Thailand",
                                    "userId": 12,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "storage_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 14,
                                    "name": "Chris Martin",
                                    "age": 34,
                                    "tel": "6655443322",
                                    "address": "Nakhon Ratchasima, Thailand",
                                    "userId": 14,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "server_room",
                            "supervisor": {
                                "profile": {
                                    "id": 15,
                                    "name": "Nancy Hill",
                                    "age": 28,
                                    "tel": "5544332211",
                                    "address": "Ubon Ratchathani, Thailand",
                                    "userId": 15,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": 23,
        "title": "Test",
        "version": 1,
        "latest": true,
        "updatedAt": "2025-01-06T23:07:28.663Z",
        "updatedBy": 1,
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "items": [
            {
                "id": 36,
                "name": "test1",
                "type": "safety",
                "checklistId": 23,
                "itemZones": [
                    {
                        "zone": {
                            "name": "r&d_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 3,
                                    "name": "Jame Smith",
                                    "age": null,
                                    "tel": "0987654321",
                                    "address": "Chiang Mai, Thailand",
                                    "userId": 3,
                                    "imageId": 1
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "assembly_line_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 4,
                                    "name": "Michael Johnson",
                                    "age": 28,
                                    "tel": "1122334455",
                                    "address": "Phuket, Thailand",
                                    "userId": 4,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "maintenance_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 12,
                                    "name": "Steven Wright",
                                    "age": 24,
                                    "tel": "8877665544",
                                    "address": "Sakon Nakhon, Thailand",
                                    "userId": 12,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
]

export const allChecklistsResponseMock = [
    {
        "id": 17,
        "title": "asdx",
        "version": 1,
        "latest": true,
        "updatedAt": "2024-12-25T14:58:26.454Z",
        "updateBy": 1,
        "updateByUserName": "Unknown User",
        "imagePath": "",
        "itemCounts": {
            "maintenance": 1
        },
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "zones": [
            "r&d_zone"
        ],
        "versionCount": 1,
        "items": [
            {
                "id": 24,
                "name": "asdf",
                "type": "maintenance",
                "checklistId": 17,
                "itemZones": [
                    {
                        "zone": {
                            "name": "r&d_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 3,
                                    "name": "Jame Smith",
                                    "age": null,
                                    "tel": "0987654321",
                                    "address": "Chiang Mai, Thailand",
                                    "userId": 3,
                                    "imageId": 1
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": 22,
        "title": "12xdasd",
        "version": 1,
        "latest": true,
        "updatedAt": "2025-01-06T21:40:10.607Z",
        "updateBy": 1,
        "updateByUserName": "Unknown User",
        "imagePath": "",
        "itemCounts": {
            "safety": 1,
            "environment": 1,
            "maintenance": 1
        },
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "zones": [
            "training_simulation_zone",
            "assembly_line_zone",
            "raw_materials_storage_zone",
            "maintenance_zone",
            "storage_zone",
            "server_room"
        ],
        "versionCount": 1,
        "items": [
            {
                "id": 33,
                "name": "asedfq",
                "type": "safety",
                "checklistId": 22,
                "itemZones": [
                    {
                        "zone": {
                            "name": "training_simulation_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 18,
                                    "name": "Brian King",
                                    "age": 36,
                                    "tel": "2211009988",
                                    "address": "Nakhon Sawan, Thailand",
                                    "userId": 18,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            },
            {
                "id": 34,
                "name": "124zxc",
                "type": "environment",
                "checklistId": 22,
                "itemZones": [
                    {
                        "zone": {
                            "name": "assembly_line_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 4,
                                    "name": "Michael Johnson",
                                    "age": 28,
                                    "tel": "1122334455",
                                    "address": "Phuket, Thailand",
                                    "userId": 4,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "raw_materials_storage_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 5,
                                    "name": "Emily Davis",
                                    "age": 32,
                                    "tel": "6677889900",
                                    "address": "Pattaya, Thailand",
                                    "userId": 5,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "training_simulation_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 18,
                                    "name": "Brian King",
                                    "age": 36,
                                    "tel": "2211009988",
                                    "address": "Nakhon Sawan, Thailand",
                                    "userId": 18,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            },
            {
                "id": 35,
                "name": "1sdfxz",
                "type": "maintenance",
                "checklistId": 22,
                "itemZones": [
                    {
                        "zone": {
                            "name": "maintenance_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 12,
                                    "name": "Steven Wright",
                                    "age": 24,
                                    "tel": "8877665544",
                                    "address": "Sakon Nakhon, Thailand",
                                    "userId": 12,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "storage_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 14,
                                    "name": "Chris Martin",
                                    "age": 34,
                                    "tel": "6655443322",
                                    "address": "Nakhon Ratchasima, Thailand",
                                    "userId": 14,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "server_room",
                            "supervisor": {
                                "profile": {
                                    "id": 15,
                                    "name": "Nancy Hill",
                                    "age": 28,
                                    "tel": "5544332211",
                                    "address": "Ubon Ratchathani, Thailand",
                                    "userId": 15,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": 23,
        "title": "Test",
        "version": 1,
        "latest": true,
        "updatedAt": "2025-01-06T23:07:28.663Z",
        "updateBy": 1,
        "updateByUserName": "Unknown User",
        "imagePath": "",
        "itemCounts": {
            "safety": 1
        },
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "zones": [
            "r&d_zone",
            "assembly_line_zone",
            "maintenance_zone"
        ],
        "versionCount": 1,
        "items": [
            {
                "id": 36,
                "name": "test1",
                "type": "safety",
                "checklistId": 23,
                "itemZones": [
                    {
                        "zone": {
                            "name": "r&d_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 3,
                                    "name": "Jame Smith",
                                    "age": null,
                                    "tel": "0987654321",
                                    "address": "Chiang Mai, Thailand",
                                    "userId": 3,
                                    "imageId": 1
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "assembly_line_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 4,
                                    "name": "Michael Johnson",
                                    "age": 28,
                                    "tel": "1122334455",
                                    "address": "Phuket, Thailand",
                                    "userId": 4,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "maintenance_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 12,
                                    "name": "Steven Wright",
                                    "age": 24,
                                    "tel": "8877665544",
                                    "address": "Sakon Nakhon, Thailand",
                                    "userId": 12,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
]

export const createChecklistMock = [
    {
        "id": 17,
        "title": "asdx",
        "version": 1,
        "latest": true,
        "updatedAt": "2024-12-25T14:58:26.454Z",
        "updateBy": 1,
        "updateByUserName": "Updated Name",
        "imagePath": "newImage.jpg",
        "itemCounts": {
            "maintenance": 1
        },
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "zones": [
            "r&d_zone"
        ],
        "versionCount": 1,
        "items": [
            {
                "id": 24,
                "name": "asdf",
                "type": "maintenance",
                "checklistId": 17,
                "itemZones": [
                    {
                        "zone": {
                            "name": "r&d_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 3,
                                    "name": "Jame Smith",
                                    "age": null,
                                    "tel": "0987654321",
                                    "address": "Chiang Mai, Thailand",
                                    "userId": 3,
                                    "imageId": 1
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": 22,
        "title": "12xdasd",
        "version": 1,
        "latest": true,
        "updatedAt": "2025-01-06T21:40:10.607Z",
        "updateBy": 1,
        "updateByUserName": "Updated Name",
        "imagePath": "newImage.jpg",
        "itemCounts": {
            "safety": 1,
            "environment": 1,
            "maintenance": 1
        },
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "zones": [
            "training_simulation_zone",
            "assembly_line_zone",
            "raw_materials_storage_zone",
            "maintenance_zone",
            "storage_zone",
            "server_room"
        ],
        "versionCount": 1,
        "items": [
            {
                "id": 33,
                "name": "asedfq",
                "type": "safety",
                "checklistId": 22,
                "itemZones": [
                    {
                        "zone": {
                            "name": "training_simulation_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 18,
                                    "name": "Brian King",
                                    "age": 36,
                                    "tel": "2211009988",
                                    "address": "Nakhon Sawan, Thailand",
                                    "userId": 18,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            },
            {
                "id": 34,
                "name": "124zxc",
                "type": "environment",
                "checklistId": 22,
                "itemZones": [
                    {
                        "zone": {
                            "name": "assembly_line_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 4,
                                    "name": "Michael Johnson",
                                    "age": 28,
                                    "tel": "1122334455",
                                    "address": "Phuket, Thailand",
                                    "userId": 4,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "raw_materials_storage_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 5,
                                    "name": "Emily Davis",
                                    "age": 32,
                                    "tel": "6677889900",
                                    "address": "Pattaya, Thailand",
                                    "userId": 5,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "training_simulation_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 18,
                                    "name": "Brian King",
                                    "age": 36,
                                    "tel": "2211009988",
                                    "address": "Nakhon Sawan, Thailand",
                                    "userId": 18,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            },
            {
                "id": 35,
                "name": "1sdfxz",
                "type": "maintenance",
                "checklistId": 22,
                "itemZones": [
                    {
                        "zone": {
                            "name": "maintenance_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 12,
                                    "name": "Steven Wright",
                                    "age": 24,
                                    "tel": "8877665544",
                                    "address": "Sakon Nakhon, Thailand",
                                    "userId": 12,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "storage_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 14,
                                    "name": "Chris Martin",
                                    "age": 34,
                                    "tel": "6655443322",
                                    "address": "Nakhon Ratchasima, Thailand",
                                    "userId": 14,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "server_room",
                            "supervisor": {
                                "profile": {
                                    "id": 15,
                                    "name": "Nancy Hill",
                                    "age": 28,
                                    "tel": "5544332211",
                                    "address": "Ubon Ratchathani, Thailand",
                                    "userId": 15,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": 23,
        "title": "Test",
        "version": 1,
        "latest": true,
        "updatedAt": "2025-01-06T23:07:28.663Z",
        "updateBy": 1,
        "updateByUserName": "Updated Name",
        "imagePath": "newImage.jpg",
        "itemCounts": {
            "safety": 1
        },
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "zones": [
            "r&d_zone",
            "assembly_line_zone",
            "maintenance_zone"
        ],
        "versionCount": 1,
        "items": [
            {
                "id": 36,
                "name": "test1",
                "type": "safety",
                "checklistId": 23,
                "itemZones": [
                    {
                        "zone": {
                            "name": "r&d_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 3,
                                    "name": "Jame Smith",
                                    "age": null,
                                    "tel": "0987654321",
                                    "address": "Chiang Mai, Thailand",
                                    "userId": 3,
                                    "imageId": 1
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "assembly_line_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 4,
                                    "name": "Michael Johnson",
                                    "age": 28,
                                    "tel": "1122334455",
                                    "address": "Phuket, Thailand",
                                    "userId": 4,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "maintenance_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 12,
                                    "name": "Steven Wright",
                                    "age": 24,
                                    "tel": "8877665544",
                                    "address": "Sakon Nakhon, Thailand",
                                    "userId": 12,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": 24,
        "title": "Security Inspection123323434",
        "version": 1,
        "latest": true,
        "updatedAt": "2025-01-13T03:13:29.308Z",
        "updateBy": 1,
        "updateByUserName": "Updated Name",
        "imagePath": "newImage.jpg",
        "itemCounts": {
            "safety": 2
        },
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "zones": [
            "raw_materials_storage_zone",
            "quality_control_zone",
            "r&d_zone",
            "assembly_line_zone"
        ],
        "versionCount": 1,
        "items": [
            {
                "id": 37,
                "name": "sss Check",
                "type": "safety",
                "checklistId": 24,
                "itemZones": [
                    {
                        "zone": {
                            "name": "raw_materials_storage_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 5,
                                    "name": "Emily Davis",
                                    "age": 32,
                                    "tel": "6677889900",
                                    "address": "Pattaya, Thailand",
                                    "userId": 5,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "quality_control_zone",
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
                ]
            },
            {
                "id": 38,
                "name": "1234 Check",
                "type": "safety",
                "checklistId": 24,
                "itemZones": [
                    {
                        "zone": {
                            "name": "r&d_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 3,
                                    "name": "Jame Smith",
                                    "age": null,
                                    "tel": "0987654321",
                                    "address": "Chiang Mai, Thailand",
                                    "userId": 3,
                                    "imageId": 1
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "assembly_line_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 4,
                                    "name": "Michael Johnson",
                                    "age": 28,
                                    "tel": "1122334455",
                                    "address": "Phuket, Thailand",
                                    "userId": 4,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
]

export const createChecklistResponseMock = {
    "message": "Checklist created successfully",
    "checklist": {
        "id": 25,
        "title": "Security InspectionTEST",
        "version": 1,
        "latest": true,
        "updatedAt": "2025-01-13T04:13:57.316Z",
        "updatedBy": 1
    }
}

export const updateChecklistMock = [
    {
        "id": 17,
        "title": "asdx",
        "version": 1,
        "latest": true,
        "updatedAt": "2024-12-25T14:58:26.454Z",
        "updateBy": 1,
        "updateByUserName": "Updated Name",
        "imagePath": "newImage.jpg",
        "itemCounts": {
            "maintenance": 1
        },
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "zones": [
            "r&d_zone"
        ],
        "versionCount": 1,
        "items": [
            {
                "id": 24,
                "name": "asdf",
                "type": "maintenance",
                "checklistId": 17,
                "itemZones": [
                    {
                        "zone": {
                            "name": "r&d_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 3,
                                    "name": "Jame Smith",
                                    "age": null,
                                    "tel": "0987654321",
                                    "address": "Chiang Mai, Thailand",
                                    "userId": 3,
                                    "imageId": 1
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": 22,
        "title": "12xdasd",
        "version": 1,
        "latest": true,
        "updatedAt": "2025-01-06T21:40:10.607Z",
        "updateBy": 1,
        "updateByUserName": "Updated Name",
        "imagePath": "newImage.jpg",
        "itemCounts": {
            "safety": 1,
            "environment": 1,
            "maintenance": 1
        },
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "zones": [
            "training_simulation_zone",
            "assembly_line_zone",
            "raw_materials_storage_zone",
            "maintenance_zone",
            "storage_zone",
            "server_room"
        ],
        "versionCount": 1,
        "items": [
            {
                "id": 33,
                "name": "asedfq",
                "type": "safety",
                "checklistId": 22,
                "itemZones": [
                    {
                        "zone": {
                            "name": "training_simulation_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 18,
                                    "name": "Brian King",
                                    "age": 36,
                                    "tel": "2211009988",
                                    "address": "Nakhon Sawan, Thailand",
                                    "userId": 18,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            },
            {
                "id": 34,
                "name": "124zxc",
                "type": "environment",
                "checklistId": 22,
                "itemZones": [
                    {
                        "zone": {
                            "name": "assembly_line_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 4,
                                    "name": "Michael Johnson",
                                    "age": 28,
                                    "tel": "1122334455",
                                    "address": "Phuket, Thailand",
                                    "userId": 4,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "raw_materials_storage_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 5,
                                    "name": "Emily Davis",
                                    "age": 32,
                                    "tel": "6677889900",
                                    "address": "Pattaya, Thailand",
                                    "userId": 5,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "training_simulation_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 18,
                                    "name": "Brian King",
                                    "age": 36,
                                    "tel": "2211009988",
                                    "address": "Nakhon Sawan, Thailand",
                                    "userId": 18,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            },
            {
                "id": 35,
                "name": "1sdfxz",
                "type": "maintenance",
                "checklistId": 22,
                "itemZones": [
                    {
                        "zone": {
                            "name": "maintenance_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 12,
                                    "name": "Steven Wright",
                                    "age": 24,
                                    "tel": "8877665544",
                                    "address": "Sakon Nakhon, Thailand",
                                    "userId": 12,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "storage_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 14,
                                    "name": "Chris Martin",
                                    "age": 34,
                                    "tel": "6655443322",
                                    "address": "Nakhon Ratchasima, Thailand",
                                    "userId": 14,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "server_room",
                            "supervisor": {
                                "profile": {
                                    "id": 15,
                                    "name": "Nancy Hill",
                                    "age": 28,
                                    "tel": "5544332211",
                                    "address": "Ubon Ratchathani, Thailand",
                                    "userId": 15,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": 23,
        "title": "Test",
        "version": 1,
        "latest": true,
        "updatedAt": "2025-01-06T23:07:28.663Z",
        "updateBy": 1,
        "updateByUserName": "Updated Name",
        "imagePath": "newImage.jpg",
        "itemCounts": {
            "safety": 1
        },
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "zones": [
            "r&d_zone",
            "assembly_line_zone",
            "maintenance_zone"
        ],
        "versionCount": 1,
        "items": [
            {
                "id": 36,
                "name": "test1",
                "type": "safety",
                "checklistId": 23,
                "itemZones": [
                    {
                        "zone": {
                            "name": "r&d_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 3,
                                    "name": "Jame Smith",
                                    "age": null,
                                    "tel": "0987654321",
                                    "address": "Chiang Mai, Thailand",
                                    "userId": 3,
                                    "imageId": 1
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "assembly_line_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 4,
                                    "name": "Michael Johnson",
                                    "age": 28,
                                    "tel": "1122334455",
                                    "address": "Phuket, Thailand",
                                    "userId": 4,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "maintenance_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 12,
                                    "name": "Steven Wright",
                                    "age": 24,
                                    "tel": "8877665544",
                                    "address": "Sakon Nakhon, Thailand",
                                    "userId": 12,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": 24,
        "title": "Security Inspection123323434",
        "version": 1,
        "latest": true,
        "updatedAt": "2025-01-13T03:13:29.308Z",
        "updateBy": 1,
        "updateByUserName": "Updated Name",
        "imagePath": "newImage.jpg",
        "itemCounts": {
            "safety": 2
        },
        "user": {
            "id": 1,
            "username": "updatedUser",
            "email": "updated@example.com",
            "profile": {
                "id": 1,
                "name": "Updated Name",
                "age": 30,
                "tel": "123456789",
                "address": "Updated Address",
                "userId": 1,
                "imageId": 2,
                "image": {
                    "id": 2,
                    "path": "newImage.jpg",
                    "timestamp": "2025-01-12T10:12:19.483Z",
                    "updatedBy": 1
                }
            }
        },
        "zones": [
            "raw_materials_storage_zone",
            "quality_control_zone",
            "r&d_zone",
            "assembly_line_zone"
        ],
        "versionCount": 1,
        "items": [
            {
                "id": 37,
                "name": "sss Check",
                "type": "safety",
                "checklistId": 24,
                "itemZones": [
                    {
                        "zone": {
                            "name": "raw_materials_storage_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 5,
                                    "name": "Emily Davis",
                                    "age": 32,
                                    "tel": "6677889900",
                                    "address": "Pattaya, Thailand",
                                    "userId": 5,
                                    "imageId": null
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "quality_control_zone",
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
                ]
            },
            {
                "id": 38,
                "name": "1234 Check",
                "type": "safety",
                "checklistId": 24,
                "itemZones": [
                    {
                        "zone": {
                            "name": "r&d_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 3,
                                    "name": "Jame Smith",
                                    "age": null,
                                    "tel": "0987654321",
                                    "address": "Chiang Mai, Thailand",
                                    "userId": 3,
                                    "imageId": 1
                                }
                            }
                        }
                    },
                    {
                        "zone": {
                            "name": "assembly_line_zone",
                            "supervisor": {
                                "profile": {
                                    "id": 4,
                                    "name": "Michael Johnson",
                                    "age": 28,
                                    "tel": "1122334455",
                                    "address": "Phuket, Thailand",
                                    "userId": 4,
                                    "imageId": null
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
]

export const updateChecklistResponseMock = {
    "message": "Checklist created successfully",
    "checklist": {
        "id": 2,
        "title": "Security InspectionTEST",
        "version": 2,
        "latest": true,
        "updatedAt": "2025-01-13T04:13:57.316Z",
        "updatedBy": 1
    }
}