import { Request, Response } from 'express';
import { prisma } from '../Utils/database';
import { getPatrol, getAllPatrols, createPatrol } from '../Controllers/patrol-controller';

jest.mock('../Utils/database', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
        },
        patrol: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
        },
    },
}));

describe('Patrol Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let json: jest.Mock;
    let send: jest.Mock;

    beforeEach(() => {
        json = jest.fn();
        send = jest.fn();
        res = {
            status: jest.fn().mockReturnValue({
                json,
                send,
            }),
        } as Partial<Response>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getPatrol', () => {
        it('should return patrol details if found', async () => {
            const userId = 1;
            req = {
                params: { id: '1' },
                user: { userId },
            } as Partial<Request>;

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ us_role: 'INSPECTOR', us_id: userId });
            (prisma.patrol.findUnique as jest.Mock).mockResolvedValue({
                pt_id: 1,
                pt_date: new Date(),
                pt_start_time: '10:00',
                pt_end_time: '11:00',
                pt_duration: 60,
                pt_status: 'Pending',
                preset: {
                    ps_id: 1,
                    ps_title: 'Test Preset',
                    ps_description: 'Description',
                    ps_version: '1.0',
                    ps_lasted: new Date(),
                    ps_update_at: new Date(),
                    ps_us_id: userId,
                    checklist: [
                        {
                            cl_id: 1,
                            checklist: {
                                cl_title: 'Test Checklist',
                                cl_version: '1.0',
                                cl_lasted: new Date(),
                                cl_update_at: new Date(),
                                cl_us_id: userId,
                                item: [
                                    { it_id: 1, it_name: 'Test Item', it_type: 'Type A', it_ze_id: 1 }
                                ],
                            },
                        },
                    ],
                },
                checklist: [{
                    pthc_us_id: userId,
                    inspector: { profile: [{ pf_id: userId, pf_name: 'Inspector Name' }] }
                }]
            });

            await getPatrol(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(send).toHaveBeenCalled(); // Check if send was called
            const patrolDetail = send.mock.calls[0][0]; // Get the first call argument of send
            expect(patrolDetail).toHaveProperty('id', 1);
            expect(patrolDetail).toHaveProperty('preset.title', 'Test Preset');
        });

        it('should return 404 if patrol not found', async () => {
            const userId = 1;
            req = {
                params: { id: '1' },
                user: { userId },
            } as Partial<Request>;

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ us_role: 'INSPECTOR', us_id: userId });
            (prisma.patrol.findUnique as jest.Mock).mockResolvedValue(null);

            await getPatrol(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(send).toHaveBeenCalledWith('Patrol not found');
        });

        it('should return 403 if user does not have access', async () => {
            const userId = 1;
            req = {
                params: { id: '1' },
                user: { userId },
            } as Partial<Request>;

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ us_role: 'USER' });
            (prisma.patrol.findUnique as jest.Mock).mockResolvedValue({
                checklist: [{ pthc_us_id: 2 }],
            });

            await getPatrol(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(json).toHaveBeenCalledWith({ message: "Access Denied" });
        });
    });

    describe('getAllPatrols', () => {
        it('should return patrols for an inspector', async () => {
            const userId = 1;
            req = { user: { userId } } as Partial<Request>;

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ us_role: 'INSPECTOR' });
            (prisma.patrol.findMany as jest.Mock).mockResolvedValue([{
                pt_id: 1,
                pt_date: new Date(),
                pt_start_time: '10:00',
                pt_end_time: '11:00',
                pt_duration: 60,
                pt_status: 'Pending',
                checklist: [{ inspector: { us_id: userId } }],
            }]);

            await getAllPatrols(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled(); // Check if json was called
        });

        it('should return 403 if user role is not INSPECTOR or ADMIN', async () => {
            const userId = 1;
            req = { user: { userId } } as Partial<Request>;

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ us_role: 'USER' });

            await getAllPatrols(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(json).toHaveBeenCalledWith({ message: "Access Denied" });
        });
    });

    describe('createPatrol', () => {
        it('should create a new patrol', async () => {
            req = {
                body: {
                    date: '2024-10-01T10:00:00Z',
                    presetId: '1',
                },
            } as Partial<Request>;

            (prisma.patrol.create as jest.Mock).mockResolvedValue({
                pt_id: 1,
                pt_date: new Date('2024-10-01T10:00:00Z'),
                pt_status: 'Pending',
                pt_ps_id: 1,
            });

            await createPatrol(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(json).toHaveBeenCalled(); // Check if json was called
        });

        it('should return 400 if required fields are missing', async () => {
            req = {
                body: {},
            } as Partial<Request>;

            await createPatrol(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(json).toHaveBeenCalledWith({ error: 'Missing required fields' });
        });
    });
});
