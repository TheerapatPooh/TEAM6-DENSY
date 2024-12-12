import { getNotifications, createNotification, updateNotification, markAllAsRead, deleteOldNotifications, logout, authenticateUser, sendEmail } from "@Controllers/util-controller.js";
import { NotificationType, Role } from "@prisma/client";
import { prismaMock } from "./mock";
import { NextFunction, Request, Response } from "express";
import { getIOInstance } from "@Utils/socket.js";
import { login } from "@Controllers/util-controller.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const mockDate = new Date(2024, 11, 11); 
jest.spyOn(Date, 'now').mockReturnValue(mockDate.getTime());
global.Date = jest.fn(() => mockDate) as unknown as DateConstructor;

jest.mock('@Utils/database.js', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    notification: {
      findMany: jest.fn()
    }
  }
}))

jest.mock('@Utils/socket.js', () => ({
  getIOInstance: jest.fn().mockReturnValue({
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  }),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockToken"),
  verify: jest.fn(),
}));

describe("login", () => {
  const mockUser = {
    id: 1,
    username: "testuser",
    email: "test@gmail.com",
    password: "hashedPassword",
    role: "inspector" as Role,
    department: "Electronic",
    createdAt: new Date(),
    active: true,
  };

  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        username: "testuser",
        password: "testpassword",
        rememberMe: true,
      },
    } as unknown as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    jest.clearAllMocks();
  });

  test("should login successfully with valid credentials", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");

    (global.Date.now as jest.Mock) = jest.fn(() => 1702310400000);

    await login(req, res);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { username: "testuser" },
    });

    expect(bcrypt.compare).toHaveBeenCalledWith("testpassword", "hashedPassword");

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: 1,
        role: "inspector",
        iat: 1702310400,
        exp: expect.any(Number),
      },
      expect.any(String)
    );

    expect(res.cookie).toHaveBeenCalledWith("authToken", "mockToken", expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Login Success", token: "mockToken" });
  });

  test("should return 401 for invalid username", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await login(req, res);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { username: "testuser" },
    });

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid username or password" });
  });

  test("should return 401 for invalid password", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await login(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith("testpassword", "hashedPassword");

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid username or password" });
  });

  test("should handle server error", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error("Database error"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Login failed", error: expect.any(Error) });
  });
});

describe('logout', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request; 
    res = {
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.clearAllMocks();
  });

  test('should logout successfully', async () => {
    await logout(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith("authToken", {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
  });

  test('should handle logout failure', async () => {
    res.clearCookie = jest.fn().mockImplementation(() => {
      throw new Error("Logout error");
    });

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Logout failed", error: expect.any(Error) });
  });
});

describe('authenticateUser', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      cookies: {
        authToken: "mockToken",
      },
    } as unknown as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    next = jest.fn();

    jest.clearAllMocks();
  });

  test('should call next() if the token is valid', () => {
    const mockDecoded = { userId: 1, role: "inspector" };
    (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

    authenticateUser(req, res, next);

    expect(req.user).toEqual(mockDecoded);

    expect(next).toHaveBeenCalled();
  });

  test('should return 401 if no token is provided', () => {
    req.cookies.authToken = undefined;

    authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Access Denied, No Token Provided" });

    expect(next).not.toHaveBeenCalled();
  });

  test('should return 400 if the token is invalid', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid Token", error: expect.any(Error) });

    expect(next).not.toHaveBeenCalled();
  });
});

describe('getNotifications', () => {
  const notificationGetAll = [{
    id: 1,
    message: "notification test",
    read: false,
    timestamp: mockDate,
    type: "request" as NotificationType,
    url: '/patrol/3',
    userId: 3,
  }];

  test('should get all notifications', async () => {
    prismaMock.notification.findMany.mockResolvedValue(notificationGetAll);

    const req = {
      user: {
        role: "inspector",
        userId: 3
      }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await getNotifications(req, res);

    expect(prismaMock.notification.findMany).toHaveBeenCalledWith({
      where: { userId: 3 },
      orderBy: { timestamp: 'desc' },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(notificationGetAll);
  });

  test('should handle errors when fetching notifications', async () => {
    prismaMock.notification.findMany.mockRejectedValue(new Error("Database error"));

    const req = {
      user: {
        role: "inspector",
        userId: 3
      }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await getNotifications(req, res);

    expect(prismaMock.notification.findMany).toHaveBeenCalledWith({
      where: { userId: 3 },
      orderBy: { timestamp: 'desc' },
    });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching notifications",
      error: expect.any(Error),
    });
  });
});

describe('createNotification', () => {
  const notificationCreate = {
    id: 1,
    message: "notification test",
    read: false,
    timestamp: mockDate,
    type: "request" as NotificationType,
    url: '/patrol/3',
    userId: 3,
  }

  test('should create notification and emit to socket', async () => {
    prismaMock.notification.create.mockResolvedValue(notificationCreate);

    const message = "notification test";
    const type = "request" as NotificationType;
    const url = "/patrol/3";
    const userId = 3;

    const data = { message, type, url, userId };

    await createNotification(data);

    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: {
        message: "notification test",
        read: false,
        timestamp: mockDate,
        type: "request" as NotificationType,
        url: '/patrol/3',
        userId: 3,
      },
    });

    expect(getIOInstance).toHaveBeenCalled();
    expect(getIOInstance().to).toHaveBeenCalledWith(userId);
    expect(getIOInstance().emit).toHaveBeenCalledWith('new_notification', notificationCreate);
  });

  test('should handle error in creating notification', async () => {
    prismaMock.notification.create.mockRejectedValue(new Error("Database error"));

    const message = "notification test";
    const type = "request" as NotificationType;
    const url = "/patrol/3";
    const userId = 3;

    const data = { message, type, url, userId };

    await createNotification(data);

    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: {
        message: "notification test",
        read: false,
        timestamp: mockDate,
        type: "request" as NotificationType,
        url: '/patrol/3',
        userId: 3,
      },
    });
  });
});

describe('updateNotification', () => {
  const notificationUpdate = {
    id: 1,
    message: "notification test",
    read: true,
    timestamp: mockDate,
    type: "request" as NotificationType,
    url: '/patrol/3',
    userId: 3,
  };

  test('should update notification', async () => {
    prismaMock.notification.update.mockResolvedValue(notificationUpdate);

    const req = {
      params: { id: "1" },
      user: {
        role: "inspector",
        userId: 3
      }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await updateNotification(req, res);

    expect(prismaMock.notification.update).toHaveBeenCalledWith({
      where: { id: parseInt("1", 10) },
      data: { read: true },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(notificationUpdate);
  });

  test('should handle server error', async () => {
    prismaMock.notification.update.mockRejectedValue(new Error("Database error"));

    const req = {
      params: { id: "1" },
      user: {
        role: "inspector",
        userId: 3
      }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await updateNotification(req, res);

    expect(prismaMock.notification.update).toHaveBeenCalledWith({
      where: { id: parseInt("1", 10) },
      data: { read: true },
    });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error updating notification", error: expect.any(Error) });
  });
});

describe('markAllAsRead', () => {
  test('should mark all as read', async () => {
    prismaMock.notification.updateMany.mockResolvedValue({
      count: 2,
    });

    const req = {
      user: {
        role: "inspector",
        userId: 3
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await markAllAsRead(req, res);

    expect(prismaMock.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: 3, read: false },
      data: { read: true },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "All notifications marked as read" });
  });

  test('should handle errors when updating notifications', async () => {
    prismaMock.notification.updateMany.mockRejectedValue(new Error("Database error"));

    const req = {
      user: {
        role: "inspector",
        userId: 3
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await markAllAsRead(req, res);

    expect(prismaMock.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: 3, read: false },
      data: { read: true },
    });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error updating notifications",
      error: expect.any(Error),
    });
  });
});

describe('removeOldNotifications', () => {
  test('should remove old notifications', async () => {
    prismaMock.notification.deleteMany.mockResolvedValue({
      count: 2,
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await deleteOldNotifications();

    expect(prismaMock.notification.deleteMany).toHaveBeenCalledWith({
      where: {
        timestamp: {
          lt: sevenDaysAgo,
        },
      },
    });
  });

  test('should handle errors when removing old notifications', async () => {
    prismaMock.notification.deleteMany.mockRejectedValue(new Error("Database error"));

    // สร้าง mock ของ console.error เพื่อจับข้อความที่พิมพ์ออกมา
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    await deleteOldNotifications();

    // ตรวจสอบว่า console.error ถูกเรียกด้วยข้อความที่ถูกต้อง
    expect(consoleErrorMock).toHaveBeenCalledWith("Error deleting old notifications:", expect.any(Error));

    // ลบ mock ของ console.error เพื่อไม่ให้กระทบกับการทดสอบอื่นๆ
    consoleErrorMock.mockRestore();
  });
});
