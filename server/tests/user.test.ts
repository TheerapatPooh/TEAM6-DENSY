import "./_mocks_/prisma.mock";

import {
  createUser,
  updateProfile,
  getUser,
  getAllUsers,
  updateUser,
  removeUser,
} from "@Controllers/user-controller.js";
import { Request, Response } from "express";
import { prismaMock } from "./_mocks_/prisma.mock";
import { allUsersMock, createUserResponseMock, updateProfileMock, updateProfileOnUserUpdateMock, updateUserMock, updateUserResponseMock, userMock } from "./_mocks_/user.mock";

// Mock Response object
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as unknown as Response;
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

describe("getUser", () => {
  test("should retrieve User successfully", async () => {
    prismaMock.user.findUnique.mockResolvedValue(userMock);
    const req = mockRequest(
      { profile: "false" },
      {},
      {},
      { userId: 1, role: "admin" }
    );
    const res = mockResponse();
    await getUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        id: true,
        username: true,
        email: true,
        password: false,
        role: true,
        createdAt: true,
        active: true,
        profile: false
          ? {
            include: {
              image: false,
            },
          }
          : undefined,
        zone: true
      },
    });
  });
});

describe("getAllUsers", () => {
  test("should retrieve All Users successfully", async () => {
    prismaMock.user.findMany.mockResolvedValue(allUsersMock);
    const req = mockRequest({ profile: "false" }, {}, { role: "admin" }, {});
    const res = mockResponse();
    await getAllUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(allUsersMock);
  });
});

describe("createUser", () => {
  test("should return the created user with a 201 status", async () => {
    prismaMock.user.create.mockResolvedValueOnce({id:1});
    prismaMock.profile.create.mockResolvedValueOnce({id:1});
    prismaMock.user.findUnique.mockResolvedValueOnce(createUserResponseMock);
    const req = mockRequest(
      {},
      {},
      {
        username: "TEST12/1/68",
        password: "12345678",
        role: "inspector",
      },
      {}
    );
    const res = mockResponse();
    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createUserResponseMock);
  });
});

describe("updateProfile", () => {
  test("should update profile and return 200", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 1 });
    prismaMock.profile.update.mockResolvedValueOnce({ id: 1 });

    const req = mockRequest(
      {},
      {},
      {
        imagePath: "newImage.jpg",
      },
      { userId: 1 }
    );
    const res = mockResponse();

    await updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updateProfileMock);
  });
});

describe("updateUser", () => {


  test("should update user and return 200", async () => {
        prismaMock.user.update.mockResolvedValueOnce(updateUserMock);
        prismaMock.profile.update.mockResolvedValueOnce(updateProfileOnUserUpdateMock);

    const req = mockRequest(
      {},
      {id: "1"},
      {
        username: "updatedUser",
        email: "updated@example.com",
        role: "admin",
        department: "UpdatedDept",
        name: "Updated Name",
        age: "30",
        tel: "123456789",
        address: "Updated Address",
      },
      { userId: 1 ,role:"admin"}
    );
    const res = mockResponse();


    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining(updateUserResponseMock)
    );
  });
});

describe("removeUser", () => {
  it("should deactivate the user and return 200", async () => {
    prismaMock.user.update.mockResolvedValueOnce({ id: 1 });
    const req = mockRequest(
      {},
      {id: "1"},
      {},
      { }
    );
    const res = mockResponse();
    await removeUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User has been deactivated successfully",
    });
  });
});
