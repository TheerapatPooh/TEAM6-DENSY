
import { getUser, getAllUsers, createUser, getProfile } from '../Controllers/user-controller';
import { prisma } from '../Utils/database';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

jest.mock('../Utils/database', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
        },
    },
}));

jest.mock('bcrypt');

describe('User Controller', () => {
    const mockRequest = (params = {}, body = {}) => {
        return {
            params,
            body,
        } as Partial<Request>;
    };
    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    };
    describe('getUser', () => {
        it('should return 404 if user not found', async () => {
            const req = mockRequest({ id: '1' }); // Pass params directly
            const res = mockResponse();

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await getUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });

        it('should return 200 and the user if found', async () => {
            const req = mockRequest({ id: '1' }); // Pass params directly
            const res = mockResponse();
            const mockUser = { us_id: 1, us_username: 'testUser' };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

            await getUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 500 on error', async () => {
            const req = mockRequest({ id: '1' }); // Pass params directly
            const res = mockResponse();

            (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

            await getUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch user' });
        });
    });


    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const mockUsers = [{ us_id: 1, us_username: 'testUser' }];

            (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

            await getAllUsers(req as Request, res as Response);

            expect(res.send).toHaveBeenCalledWith(mockUsers);
        });

        it('should return 500 on error', async () => {
            const req = mockRequest();
            const res = mockResponse();

            (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

            await getAllUsers(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('createUser', () => {
        it('should create a new user and return it', async () => {
            const req = mockRequest();
            req.body = {
                username: 'testUser',
                email: 'test@example.com',
                password: 'password',
                role: 'user',
                department: 'IT',
            };
            const res = mockResponse();
            const mockNewUser = { us_id: 1, us_username: 'testUser' };

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (prisma.user.create as jest.Mock).mockResolvedValue(mockNewUser);

            await createUser(req as Request, res as Response);

            expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    us_username: 'testUser',
                    us_email: 'test@example.com',
                    us_password: 'hashedPassword',
                    us_role: 'user',
                    us_department: 'IT',
                },
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockNewUser);
        });

        it('should return 500 on error', async () => {
            const req = mockRequest();
            req.body = {
                username: 'testUser',
                email: 'test@example.com',
                password: 'password',
            };
            const res = mockResponse();

            (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hashing error'));

            await createUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getProfile', () => {
        it('should return user profile if found', async () => {
            const req = mockRequest();
            (req as any).user = { userId: 1 }; // Simulate authenticated user
            const res = mockResponse();
            const mockUserWithProfile = { us_id: 1, us_username: 'testUser', profile: {} };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUserWithProfile);

            await getProfile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUserWithProfile);
        });

        it('should return 404 if user or profile not found', async () => {
            const req = mockRequest();
            (req as any).user = { userId: 1 }; // Simulate authenticated user
            const res = mockResponse();

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await getProfile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User or Profile not found' });
        });

        it('should return 500 on error', async () => {
            const req = mockRequest();
            (req as any).user = { userId: 1 }; // Simulate authenticated user
            const res = mockResponse();

            (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

            await getProfile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch user profile' });
        });
    });
});
