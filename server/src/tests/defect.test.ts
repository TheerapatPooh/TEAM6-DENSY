// defect-controller.test.ts
import './_mocks_/prisma.mock';

import { Request, Response } from 'express';
import { prismaMock } from './_mocks_/prisma.mock';
import { confirmComment, createDefect, getAllComments, getAllDefects, getDefect, updateDefect } from '@Controllers/defect-controller.js';
import { allDefects, commentMock, defectMock, fileMock, getAllCommentsMock, updateDefectMock } from './_mocks_/defect.mock';

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

describe('createDefect', () => {
    test('ควรสร้างข้อมูล Defect ได้สำเร็จ', async () => {
        prismaMock.defect.create.mockResolvedValueOnce({ id: 1 });
        prismaMock.patrol.findFirst.mockResolvedValueOnce(defectMock.patrol);
        prismaMock.defect.findFirst.mockResolvedValueOnce(defectMock.defect);
        prismaMock.patrolResult.findUnique.mockResolvedValueOnce(defectMock.patrolResult);
        prismaMock.patrolResult.update.mockResolvedValueOnce({ id: 17, status: false });
        prismaMock.image.create.mockResolvedValueOnce(defectMock.defect.images[0].image);
        prismaMock.defectImage.create.mockResolvedValueOnce(defectMock.defect.images[0]);

        const req = mockRequest(
            {},
            {},
            {
                "name": "Floor Cleanliness Check",
                "description": "Test Defect",
                "type": "environment",
                "defectUserId": 3,
                "patrolResult": 17,
                "supervisorId": 6
            },
            { role: "inspector", userId: 3 });
        req.files = [fileMock];

        const res = mockResponse();

        await createDefect(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(defectMock.defect);
    });
});

describe('getDefect', () => {
    test('ควรดึงข้อมูล Defect ได้ถูกต้อง', async () => {
        prismaMock.defect.findUnique.mockResolvedValueOnce(defectMock.defect);

        const req = mockRequest(
            {},
            { id: 1 },
            {},
            { role: "inspector", userId: 3 });

        const res = mockResponse();

        await getDefect(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(defectMock.defect);
    });
});

describe('getAllDefect', () => {
    test('ควรดึงข้อมูล Defect ทั้งหมดที่ตัวเองเกี่ยวข้องได้ถูกต้อง', async () => {
        prismaMock.defect.findMany.mockResolvedValueOnce(allDefects);

        const req = mockRequest(
            {},
            { status: "reported" },
            {},
            { role: "inspector", userId: 3 });

        const res = mockResponse();

        await getAllDefects(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(allDefects);
    });
});

describe('updateDefect', () => {
    test('ควรแก้ไขข้อมูล Defect ได้ถูกต้อง', async () => {
        prismaMock.defect.findUnique.mockResolvedValueOnce(defectMock.defect);
        prismaMock.defect.update.mockResolvedValueOnce({ id: 1, desciption: "Test Defect Edit" });
        prismaMock.defect.findUnique.mockResolvedValueOnce(updateDefectMock);

        const req = mockRequest(
            {},
            { desciption: "Test Defect Edit" },
            { id: 1 },
            { role: "inspector", userId: 3 });

        const res = mockResponse();

        await updateDefect(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updateDefectMock);
    });
});

describe('getAllComments', () => {
    test('ควรดึงข้อมูล Comment ทั้งหมดที่ตัวเองเกี่ยวข้องได้ถูกต้อง', async () => {
        prismaMock.comment.findMany.mockResolvedValueOnce(getAllCommentsMock);
        const req = mockRequest(
            {},
            {},
            {},
            { role: "supervisor", userId: 6 });

        const res = mockResponse();

        await getAllComments(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(getAllCommentsMock);
    });
});

describe('confirmComment', () => {
    test('ควรอัปเดตสถานะ Comment ได้ถูกต้อง', async () => {
        prismaMock.comment.update.mockResolvedValueOnce(commentMock);
        prismaMock.comment.findUnique.mockResolvedValueOnce(commentMock);
        const req = mockRequest(
            {},
            { id: 1 },
            { status: true},
            { role: "inspector", userId: 3 });

        const res = mockResponse();

        await confirmComment(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(commentMock);
    });
});
