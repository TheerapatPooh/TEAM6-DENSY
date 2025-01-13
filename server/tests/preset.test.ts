import "./_mocks_/prisma.mock";
import { Request, Response } from "express";
import { prismaMock } from "./_mocks_/prisma.mock";
import {
  createChecklist,
  createPreset,
  getAllChecklists,
  getAllPresets,
  getChecklist,
  getPreset,
  removeChecklist,
  removePreset,
  updateChecklist,
  updatePreset,
} from "@Controllers/preset-controller.js";
import {
  allChecklistsMock,
  allChecklistsResponseMock,
  allPresetsMock,
  allPresetsResponseMock,
  checklistResponseMock,
  createChecklistMock,
  createChecklistResponseMock,
  presetMock,
  updateChecklistMock,
  updateChecklistResponseMock,
} from "./_mocks_/preset.mock";

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

describe("getPreset", () => {
  test("should retrieve Preset successfully", async () => {
    prismaMock.preset.findUnique.mockResolvedValue(presetMock);
    const req = mockRequest({}, { id: 1 }, {}, {});
    const res = mockResponse();
    await getPreset(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(prismaMock.preset.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        id: true,
        title: true,
        description: true,
        presetChecklists: {
          select: {
            checklist: {
              select: {
                id: true,
                title: true,
                items: {
                  include: {
                    itemZones: {
                      select: {
                        zone: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  });
});

describe("getAllPresets", () => {
  test("should retrieve All Presets successfully", async () => {
    prismaMock.preset.findMany.mockResolvedValue(allPresetsMock);
    const req = mockRequest({}, {}, {}, {});
    const res = mockResponse();
    await getAllPresets(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(allPresetsResponseMock);
  });
});

describe("createPreset", () => {
  test("should Create Preset successfully", async () => {
    prismaMock.preset.create.mockResolvedValue({ id: 1 });
    prismaMock.presetChecklist.create.mockResolvedValue({ id: 1 });

    const req = mockRequest(
      {},
      {},
      {
        title: "testPreset",
        description: "testPresetDestcrip",
        checklists: [1, 2, 3],
      },
      { userId: 1 }
    );
    const res = mockResponse();
    await createPreset(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Preset created successfully",
      preset: { id: 1 },
    });
  });
});

describe("updatePreset", () => {
  test("should Updated Preset successfully", async () => {
    prismaMock.preset.findUnique.mockResolvedValue({ presetId: 1 });
    prismaMock.preset.update.mockResolvedValue({ presetId: 1 });
    prismaMock.preset.create.mockResolvedValue({ id: 2 });
    prismaMock.presetChecklist.create.mockResolvedValue({ id: 1 });

    const req = mockRequest(
      {},
      { id: 1 },
      {
        title: "testUpdatePreset",
        description: "testUpdatePresetDestcrip",
        checklists: [1, 2, 3],
      },
      { userId: 1 }
    );
    const res = mockResponse();
    await updatePreset(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Preset updated successfully",
      preset: { id: 2 },
    });
  });
});

describe("removePreset", () => {
  test("should Remove Preset successfully", async () => {
    prismaMock.patrol.count.mockResolvedValue({ presetId: 1 });
    prismaMock.presetChecklist.deleteMany.mockResolvedValue({ presetId: 1 });
    prismaMock.preset.delete.mockResolvedValue({ id: 1 });

    const req = mockRequest({}, { id: 1 }, {}, {});
    const res = mockResponse();
    await removePreset(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Preset removed successfully",
    });
  });
});

describe("getChecklist", () => {
  test("should get Checklist successfully", async () => {
    prismaMock.checklist.findUnique.mockResolvedValue(checklistResponseMock);
    const req = mockRequest({}, { id: 1 }, {}, {});
    const res = mockResponse();
    await getChecklist(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(prismaMock.checklist.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        items: {
          select: {
            id: true,
            name: true,
            type: true,
            checklistId: true,
            itemZones: {
              select: {
                zone: {
                  select: {
                    id: true,
                    name: true,
                    supervisor: false
                      ? {
                          select: {
                            id: true,
                            role: true,
                            profile: {
                              select: {
                                id: true,
                                name: true,
                                age: true,
                                tel: true,
                                address: true,
                              },
                            },
                          },
                        }
                      : undefined,
                  },
                },
              },
            },
          },
        },
      },
    });
  });
});

describe("getAllChecklists", () => {
  test("should get All Checklists successfully", async () => {
    prismaMock.checklist.findMany.mockResolvedValueOnce(allChecklistsMock);
    prismaMock.checklist.findMany.mockResolvedValueOnce(allChecklistsMock);

    const req = mockRequest({}, {}, {}, {});
    const res = mockResponse();

    await getAllChecklists(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(allChecklistsResponseMock);
  });
});

describe("createChecklist", () => {
  test("should Create Checklist successfully", async () => {
    prismaMock.checklist.create.mockResolvedValue(createChecklistResponseMock);
    prismaMock.item.create.mockResolvedValue(createChecklistMock[0].items);
    prismaMock.zone.findUnique.mockResolvedValue(createChecklistMock[0].zones);

    const req = mockRequest(
      {},
      {},
      {
        title: "Security InspectionTest",
        items: [
          {
            name: "sss Check",
            type: "safety",
            zoneId: [3, 4],
          },
          {
            name: "1234 Check",
            type: "safety",
            zoneId: [1, 2],
          },
        ],
      },
      {userId:1}
    );
    const res = mockResponse();
    await createChecklist(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({"checklist": {"checklist": {"id": 25, "latest": true, "title": "Security InspectionTEST", "updatedAt": "2025-01-13T04:13:57.316Z", "updatedBy": 1, "version": 1}, "message": "Checklist created successfully"}, "message": "Checklist created successfully"}            );
  });
});



describe("updateChecklist", () => {
    test("should Update Checklist successfully", async () => {
      prismaMock.checklist.create.mockResolvedValue(updateChecklistResponseMock);
      prismaMock.item.create.mockResolvedValue(updateChecklistMock[0].items);
      prismaMock.zone.findUnique.mockResolvedValue(updateChecklistMock[0].zones);
  
      const req = mockRequest(
        {},
        {id:1},
        {
          title: "Safety Inspection",
          items: [
            {
              name: "sss Check",
              type: "safety",
              zoneId: [3, 4],
            },
            {
              name: "1234 Check",
              type: "safety",
              zoneId: [1, 2],
            },
          ],
        },
        {userId:1}
      );
      const res = mockResponse();
      await updateChecklist(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({"checklists": {"checklist": {"id": 2, "latest": true, "title": "Security InspectionTEST", "updatedAt": "2025-01-13T04:13:57.316Z", "updatedBy": 1, "version": 2}, "message": "Checklist created successfully"}, "message": "Checklist update successfully"});
    });
  });

  describe("removeChecklist", () => {
    test("should Remove Checklist successfully", async () => {
      prismaMock.checklist.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.checklist.update.mockResolvedValue({ id: 1 });
  
      const req = mockRequest({}, { id: 1 }, {}, {});
      const res = mockResponse();
      await removeChecklist(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Checklist has been deactivated successfully" });
    });
  });