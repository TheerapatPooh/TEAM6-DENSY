// location-controller.test.ts
import './_mocks_/prisma.mock';

import { Request, Response } from 'express';
import { prismaMock } from './_mocks_/prisma.mock';
import { allZonesMock, locationMock, updateSupervisorMock, zoneMock } from './_mocks_/location.mock';
import { getAllZones, getLocation, getZone, updateSupervisor } from '@Controllers/location-controller.js';

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

describe('getZone', () => {
    test('ควรดึงข้อมูล Zone ได้ถูกต้อง', async () => {
        prismaMock.zone.findUnique.mockResolvedValue(zoneMock);

        const req = mockRequest({}, { id: '1' }, {}, { userId: 3 });
        const res = mockResponse();

        await getZone(req, res);

        expect(prismaMock.zone.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: {
                supervisor: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                        department: true,
                        createdAt: true,
                        profile: {
                            select: {
                                name: true,
                                tel: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(zoneMock);

    });
});

describe('getAllZones', () => {
    test('ควรดึงข้อมูลทุก Zone ได้ถูกต้อง', async () => {
        prismaMock.zone.findMany.mockResolvedValue(allZonesMock);

        const req = mockRequest({}, { id: '1' }, {}, { userId: 3 });
        const res = mockResponse();

        await getAllZones(req, res);

        expect(prismaMock.zone.findMany).toHaveBeenCalledWith({
            select: {
                id: true,
                name: true,
            }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(allZonesMock);

    });
});

describe('getLocation', () => {
    test('ควรดึงข้อมูล Location พร้อมกับ Zone ที่เกี่ยวข้องได้ถูกต้อง', async () => {
        prismaMock.location.findUnique.mockResolvedValue(locationMock);

        const req = mockRequest({}, { id: '1' }, {}, { userId: 3 });
        const res = mockResponse();

        await getLocation(req, res);

        expect(prismaMock.location.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: {
                zones: {
                    include: {
                        supervisor: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                role: true,
                                department: true,
                                createdAt: true,
                                profile: { select: { image: true, tel: true, name: true } },

                            },
                        },
                    },
                },
            },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(locationMock);

    });
});

describe('updateSupervisor', () => {
    test('ควรอัปเดต Supervisor ของ Zone ได้สำเร็จ', async () => {
        prismaMock.zone.findUnique.mockResolvedValue(updateSupervisorMock);
        prismaMock.zone.update.mockResolvedValue({
            id: 1,
            name: "assembly_line_zone",
            userId: 16,
        });

        const req = mockRequest({}, { id: '1' }, { userId: 16 }, { userId: 1, role: 'admin' });
        const res = mockResponse();

        await updateSupervisor(req, res);

        expect(prismaMock.zone.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: {
                supervisor: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                        department: true,
                        createdAt: true,
                        profile: {
                            select: {
                                image: true,
                                name: true,
                                tel: true
                            }
                        }
                    }
                }
            },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updateSupervisorMock);

    });
});