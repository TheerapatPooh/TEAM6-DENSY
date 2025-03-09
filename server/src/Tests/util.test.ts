import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticateUser, authorized, getAllNotifications, login, logout, markAllAsRead, removeAllNotifications, removeOldNotifications, updateNotification } from "@Controllers/util-controller.js";
import { prismaMock } from "./_mocks_/prisma.mock";
import { allNotificationMock, createNotificationMock, decodeMock, notificationMock, updateNotificationMock, userMock } from "./_mocks_/util.mock";

// Mock Response object
const mockResponse = (overrides: Partial<Response> = {}) => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    ...overrides,
  };
  return res as Response;
};

// Mock Request object
const mockRequest = (query: any, params: any, body: any, user: any, cookies: any) => {
  return {
    query,
    params,
    body,
    user,
    cookies,
  } as unknown as Request;
};

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('login', () => {
  test('ควรเข้าสู่ระบบได้สำเร็จ', async () => {
    prismaMock.user.findUnique.mockResolvedValue(userMock);
    prismaMock.session.create.mockResolvedValue({
      userId: userMock.id,
      token: "mockSessionId",
      expiresAt: new Date(),
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");

    (global.Date.now as jest.Mock) = jest.fn(() => 1702310400000);

    const req = mockRequest(
      {},
      {},
      {
        username: "testuser",
        password: "testpassword",
        rememberMe: true,
      },
      {},
      {});

    const res = mockResponse();

    await login(req, res);
    expect(bcrypt.compare).toHaveBeenCalledWith("testpassword", "hashedPassword");
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: 1,
        role: "inspector",
        sessionId: expect.any(String),

      },
      expect.any(String),
      { expiresIn: "1h" }
    );

    expect(res.cookie).toHaveBeenCalledWith("authToken", "mockToken", expect.any(Object));
    expect(res.cookie).toHaveBeenCalledWith("refreshToken", expect.any(String), expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Login Success", accessToken: "mockToken", refreshToken: expect.any(String) });
  });
});

describe('logout', () => {
  test('ควรออกจากระบบได้สำเร็จ', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ userId: 1, role: "inspector" });
    prismaMock.session.deleteMany.mockResolvedValue({ count: 1 });

    const req = mockRequest(
      {},
      {},
      {},
      {},
      { authToken: "mockToken" });

    const res = mockResponse();

    await logout(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith("authToken", {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", expect.objectContaining({
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
  });
});

describe('authenticateUser', () => {
  test('ควรยืนยันตัวตนผู้ใช้งานได้สำเร็จ', async () => {
    (jwt.verify as jest.Mock).mockReturnValue(decodeMock);
    const now = new Date();
    prismaMock.session.findUnique.mockResolvedValue({
      id: 1,
      userId: decodeMock.userId,
      token: decodeMock.sessionId,
      expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
    });

    const req = mockRequest(
      {},
      {},
      {},
      {},
      { authToken: "mockToken" });

    const res = mockResponse();
    const next = jest.fn();

    await authenticateUser(req, res, next);
    expect(req.user).toEqual(decodeMock);
    expect(next).toHaveBeenCalled();
  });
});

describe('getAllNotifications', () => {
  test('ควรดึงข้อมูล Notification ได้ถูกต้อง', async () => {
    prismaMock.notification.findMany.mockResolvedValueOnce(allNotificationMock);

    const req = mockRequest(
      {},
      {},
      {},
      { role: "inspector", userId: 3 },
      {});

    const res = mockResponse();

    await getAllNotifications(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(allNotificationMock);
  });
});


jest.mock('@Utils/socket.js', () => ({
  getIOInstance: jest.fn().mockReturnValue({
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  }),
}));

describe('updateNotification', () => {
  test('ควรเปลี่ยนสถานะ Notification เป็น "อ่านแล้ว"', async () => {
    prismaMock.notification.update.mockResolvedValueOnce(updateNotificationMock);

    const req = mockRequest(
      {},
      {},
      { id: 1 },
      { role: "inspector", userId: 3 },
      {});

    const res = mockResponse();

    await updateNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updateNotificationMock);
  });
});

describe('markAllAsRead', () => {
  test('ควรเปลี่ยนสถานะ Notification ทั้งหมดเป็น "อ่านแล้ว"', async () => {
    prismaMock.notification.updateMany.mockResolvedValueOnce({
      count: 2,
    });

    const req = mockRequest(
      {},
      {},
      { id: 1 },
      { role: "inspector", userId: 3 },
      {});

    const res = mockResponse();

    await markAllAsRead(req, res);
    expect(prismaMock.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: 3, read: false },
      data: { read: true },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "All notifications marked as read" });
  });
});

describe('removeOldNotifications', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-12T15:09:36.718Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  test('ควรลบ Notification ที่เก่ากว่า 7 วัน', async () => {
    prismaMock.notification.deleteMany.mockResolvedValueOnce({
      count: 2,
    });


    const sevenDaysAgo = new Date("2025-01-12T15:09:36.718Z");
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await removeOldNotifications();
    expect(prismaMock.notification.deleteMany).toHaveBeenCalledWith({
      where: {
        timestamp: {
          lt: sevenDaysAgo,
        },
      },
    });
  });
});

describe('removeAllNotifications', () => {
  test('ควรลบ Notification ทั้งหมดของผู้ใช้', async () => {
    prismaMock.notification.deleteMany.mockResolvedValueOnce({
      count: 2,
    })
    const req = mockRequest(
      {},
      {},
      {},
      { role: "inspector", userId: 3 },
      {});

    const res = mockResponse();

    await removeAllNotifications(req, res);
    expect(prismaMock.notification.deleteMany).toHaveBeenCalledWith({
      where: {
        userId: 3,
      },
    });
  });
});

describe('authorized', () => {
  test('ควรอนุญาตให้ผู้ใช้ที่มีบทบาทใน allowedRoles ผ่านได้', async () => {
    const allowedRoles = ["admin", "inspector"];
    const middleware = authorized(allowedRoles);

    const req = mockRequest({}, {}, {}, { role: "inspector", userId: 3 }, {});
    const res = mockResponse();
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
