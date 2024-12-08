// util-controller.test.ts
import { login, logout, authenticateUser } from '@Controllers/util-controller';
import { prisma } from '@Utils/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { jest } from "@jest/globals";

jest.mock('@Utils/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  const mockRequest = () => {
    return {
      body: {
        username: 'testUser',
        password: 'testPassword',
        rememberMe: false,
      },
      cookies: {},
    } as Partial<Request>;
  };

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn() as NextFunction;

  describe('login', () => {
    it('should return 401 if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const req = mockRequest();
      const res = mockResponse();

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid username or password" });
    });

    it('should return 401 if password is incorrect', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        us_password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const req = mockRequest();
      const res = mockResponse();

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid username or password" });
    });

    it('should return 200 and set cookie if login is successful', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        us_id: 1,
        us_role: 'user',
        us_password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const req = mockRequest();
      const res = mockResponse();

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Login Success", token: 'mockToken' });
      expect(res.cookie).toHaveBeenCalledWith("authToken", 'mockToken', expect.any(Object));
    });
  });

  describe('logout', () => {
    it('should clear authToken cookie and return success message', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await logout(req as Request, res as Response);

      expect(res.clearCookie).toHaveBeenCalledWith("authToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
    });
  });

  describe('authenticateUser', () => {
    it('should return 401 if no token is provided', () => {
      const req = mockRequest();
      const res = mockResponse();

      authenticateUser(req as Request, res as Response, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Access Denied, No Token Provided" });
    });

    it('should return 400 if the token is invalid', () => {
      const req = {
        ...mockRequest(),
        cookies: {
          authToken: 'invalidToken',
        },
      } as Partial<Request>;
      const res = mockResponse();

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authenticateUser(req as Request, res as Response, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid Token" });
    });

    it('should call next if the token is valid', () => {
      const req = {
        ...mockRequest(),
        cookies: {
          authToken: 'validToken',
        },
      } as Partial<Request>;
      const res = mockResponse();

      (jwt.verify as jest.Mock).mockReturnValue({ userId: 1, role: 'user' });

      authenticateUser(req as Request, res as Response, mockNext);

      expect(req.user).toEqual({ userId: 1, role: 'user' });
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
