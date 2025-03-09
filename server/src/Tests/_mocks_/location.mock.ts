export const zoneMock = {
    "id": 1,
    "name": "r&d_zone",
    "locationId": 1,
    "userId": 3,
    "supervisor": {
        "id": 3,
        "username": "jameSmith",
        "email": null,
        "role": "inspector",
        "department": null,
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
};

export const allZonesMock = [
    {
        "id": 1,
        "name": "r&d_zone"
    },
    {
        "id": 2,
        "name": "assembly_line_zone"
    },
    {
        "id": 3,
        "name": "raw_materials_storage_zone"
    },
    {
        "id": 4,
        "name": "quality_control_zone"
    },
    {
        "id": 5,
        "name": "it_zone"
    },
    {
        "id": 6,
        "name": "customer_service_zone"
    },
    {
        "id": 7,
        "name": "prototype_zone"
    },
    {
        "id": 8,
        "name": "manager_office"
    },
    {
        "id": 9,
        "name": "water_supply"
    },
    {
        "id": 10,
        "name": "maintenance_zone"
    },
    {
        "id": 11,
        "name": "warehouse"
    },
    {
        "id": 12,
        "name": "storage_zone"
    },
    {
        "id": 13,
        "name": "server_room"
    },
    {
        "id": 14,
        "name": "electrical_zone"
    },
    {
        "id": 15,
        "name": "engineering_zone"
    },
    {
        "id": 16,
        "name": "training_simulation_zone"
    },
    {
        "id": 17,
        "name": "workstation_a"
    },
    {
        "id": 18,
        "name": "workstation_b"
    },
    {
        "id": 19,
        "name": "testing_lab"
    }
];

export const updateSupervisorMock = {
    "id": 1,
    "name": "r&d_zone",
    "locationId": 1,
    "userId": 16,
    "supervisor": {
        "id": 16,
        "username": "supervisor14",
        "email": "supervisor14@example.com",
        "role": "supervisor",
        "department": "R&D",
        "createdAt": "2024-10-06T10:27:09.916Z",
        "profile": {
            "id": 16,
            "name": "Kevin Scott",
            "age": 27,
            "tel": "4433221100",
            "address": "Chiang Rai, Thailand",
            "userId": 16,
            "imageId": null,
            "image": null
        }
    }
};

export const locationMock = {
    "id": 1,
    "name": "Factory A",
    "zones": [
        {
            "id": 1,
            "name": "r&d_zone",
            "locationId": 1,
            "userId": 3,
            "supervisor": {
                "id": 3,
                "username": "jameSmith",
                "email": null,
                "role": "inspector",
                "department": null,
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
        },
        {
            "id": 2,
            "name": "assembly_line_zone",
            "locationId": 1,
            "userId": 4,
            "supervisor": {
                "id": 4,
                "username": "supervisor2",
                "email": "supervisor2@example.com",
                "role": "supervisor",
                "department": "IT",
                "createdAt": "2024-10-06T09:51:09.771Z",
                "profile": {
                    "id": 4,
                    "name": "Michael Johnson",
                    "age": 28,
                    "tel": "1122334455",
                    "address": "Phuket, Thailand",
                    "userId": 4,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 3,
            "name": "raw_materials_storage_zone",
            "locationId": 1,
            "userId": 5,
            "supervisor": {
                "id": 5,
                "username": "supervisor3",
                "email": "supervisor3@example.com",
                "role": "supervisor",
                "department": "Maintenance",
                "createdAt": "2024-10-06T09:51:12.275Z",
                "profile": {
                    "id": 5,
                    "name": "Emily Davis",
                    "age": 32,
                    "tel": "6677889900",
                    "address": "Pattaya, Thailand",
                    "userId": 5,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 4,
            "name": "quality_control_zone",
            "locationId": 1,
            "userId": 6,
            "supervisor": {
                "id": 6,
                "username": "supervisor4",
                "email": "supervisor4@example.com",
                "role": "supervisor",
                "department": "Customer Service",
                "createdAt": "2024-10-06T09:51:14.185Z",
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
        },
        {
            "id": 5,
            "name": "it_zone",
            "locationId": 1,
            "userId": 7,
            "supervisor": {
                "id": 7,
                "username": "supervisor5",
                "email": "supervisor5@example.com",
                "role": "supervisor",
                "department": "Quality Control",
                "createdAt": "2024-10-06T09:51:28.164Z",
                "profile": {
                    "id": 7,
                    "name": "Sophia Taylor",
                    "age": 35,
                    "tel": "4455667788",
                    "address": "Korat, Thailand",
                    "userId": 7,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 6,
            "name": "customer_service_zone",
            "locationId": 1,
            "userId": 8,
            "supervisor": {
                "id": 8,
                "username": "supervisor6",
                "email": "supervisor6@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 8,
                    "name": "Jack Danial",
                    "age": 27,
                    "tel": "3344556677",
                    "address": "Khon Kaen, Thailand",
                    "userId": 8,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 7,
            "name": "prototype_zone",
            "locationId": 1,
            "userId": 9,
            "supervisor": {
                "id": 9,
                "username": "supervisor7",
                "email": "supervisor7@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 9,
                    "name": "Lisa Brown",
                    "age": 26,
                    "tel": "2211334455",
                    "address": "Nakhon Pathom, Thailand",
                    "userId": 9,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 8,
            "name": "manager_office",
            "locationId": 1,
            "userId": 10,
            "supervisor": {
                "id": 10,
                "username": "supervisor8",
                "email": "supervisor8@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 10,
                    "name": "Mark Lee",
                    "age": 31,
                    "tel": "1199887766",
                    "address": "Rayong, Thailand",
                    "userId": 10,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 9,
            "name": "water_supply",
            "locationId": 1,
            "userId": 11,
            "supervisor": {
                "id": 11,
                "username": "supervisor9",
                "email": "supervisor9@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 11,
                    "name": "Karen Clark",
                    "age": 33,
                    "tel": "9988776655",
                    "address": "Udon Thani, Thailand",
                    "userId": 11,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 10,
            "name": "maintenance_zone",
            "locationId": 1,
            "userId": 12,
            "supervisor": {
                "id": 12,
                "username": "supervisor10",
                "email": "supervisor10@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 12,
                    "name": "Steven Wright",
                    "age": 24,
                    "tel": "8877665544",
                    "address": "Sakon Nakhon, Thailand",
                    "userId": 12,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 11,
            "name": "warehouse",
            "locationId": 1,
            "userId": 13,
            "supervisor": {
                "id": 13,
                "username": "supervisor11",
                "email": "supervisor11@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 13,
                    "name": "Michelle Green",
                    "age": 29,
                    "tel": "7766554433",
                    "address": "Surat Thani, Thailand",
                    "userId": 13,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 12,
            "name": "storage_zone",
            "locationId": 1,
            "userId": 14,
            "supervisor": {
                "id": 14,
                "username": "supervisor12",
                "email": "supervisor12@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 14,
                    "name": "Chris Martin",
                    "age": 34,
                    "tel": "6655443322",
                    "address": "Nakhon Ratchasima, Thailand",
                    "userId": 14,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 13,
            "name": "server_room",
            "locationId": 1,
            "userId": 15,
            "supervisor": {
                "id": 15,
                "username": "supervisor13",
                "email": "supervisor13@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 15,
                    "name": "Nancy Hill",
                    "age": 28,
                    "tel": "5544332211",
                    "address": "Ubon Ratchathani, Thailand",
                    "userId": 15,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 14,
            "name": "electrical_zone",
            "locationId": 1,
            "userId": 16,
            "supervisor": {
                "id": 16,
                "username": "supervisor14",
                "email": "supervisor14@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 16,
                    "name": "Kevin Scott",
                    "age": 27,
                    "tel": "4433221100",
                    "address": "Chiang Rai, Thailand",
                    "userId": 16,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 15,
            "name": "engineering_zone",
            "locationId": 1,
            "userId": 17,
            "supervisor": {
                "id": 17,
                "username": "supervisor15",
                "email": "supervisor15@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 17,
                    "name": "Laura Young",
                    "age": 30,
                    "tel": "3322110099",
                    "address": "Lampang, Thailand",
                    "userId": 17,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 16,
            "name": "training_simulation_zone",
            "locationId": 1,
            "userId": 18,
            "supervisor": {
                "id": 18,
                "username": "supervisor16",
                "email": "supervisor16@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 18,
                    "name": "Brian King",
                    "age": 36,
                    "tel": "2211009988",
                    "address": "Nakhon Sawan, Thailand",
                    "userId": 18,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 17,
            "name": "workstation_a",
            "locationId": 1,
            "userId": 19,
            "supervisor": {
                "id": 19,
                "username": "supervisor17",
                "email": "supervisor17@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 19,
                    "name": "Rachel Allen",
                    "age": 23,
                    "tel": "1100998877",
                    "address": "Trang, Thailand",
                    "userId": 19,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 18,
            "name": "workstation_b",
            "locationId": 1,
            "userId": 20,
            "supervisor": {
                "id": 20,
                "username": "supervisor18",
                "email": "supervisor18@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 20,
                    "name": "George Baker",
                    "age": 31,
                    "tel": "0099887766",
                    "address": "Nonthaburi, Thailand",
                    "userId": 20,
                    "imageId": null,
                    "image": null
                }
            }
        },
        {
            "id": 19,
            "name": "testing_lab",
            "locationId": 1,
            "userId": 21,
            "supervisor": {
                "id": 21,
                "username": "supervisor19",
                "email": "supervisor19@example.com",
                "role": "supervisor",
                "department": "R&D",
                "createdAt": "2024-10-06T10:27:09.916Z",
                "profile": {
                    "id": 21,
                    "name": "Jessica Adams",
                    "age": 29,
                    "tel": "9988776655",
                    "address": "Ayutthaya, Thailand",
                    "userId": 21,
                    "imageId": null,
                    "image": null
                }
            }
        }
    ]
};