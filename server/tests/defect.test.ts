import { createDefect } from '@Controllers/defect-controller';
import { prisma } from '@Utils/database';
import { Request, Response } from 'express';
import { jest } from "@jest/globals";

jest.mock('@Utils/database', () => ({
    prisma: {
        defect: {
            create: jest.fn(),
        },
    },
}));

describe('createDefect', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let status: jest.Mock;
    let json: jest.Mock;
    let send: jest.Mock;

    beforeEach(() => {
        req = {
            body: {
                title: 'Test Defect',
                note: 'This is a test defect',
                type: 'Bug',
                status: 'Open',
                userId: 1,
            },
        };

        status = jest.fn().mockReturnThis();
        json = jest.fn();
        send = jest.fn();

        res = {
            status,
            json,
            send,
        };
    });

    it('should create a new defect and return it', async () => {
        const newDefect = {
            id: 1,
            df_title: req.body.title,
            df_note: req.body.note,
            df_type: req.body.type,
            df_status: req.body.status,
            df_us_id: req.body.userId,
        };

        (prisma.defect.create as jest.Mock).mockResolvedValue(newDefect);

        await createDefect(req as Request, res as Response);

        expect(prisma.defect.create).toHaveBeenCalledWith({
            data: {
                df_title: req.body.title,
                df_note: req.body.note,
                df_type: req.body.type,
                df_status: req.body.status,
                df_us_id: req.body.userId,
            },
        });
        expect(status).toHaveBeenCalledWith(201);
        expect(json).toHaveBeenCalledWith(newDefect);
    });

    it('should handle errors and return a 500 status', async () => {
        const errorMessage = 'Database error';
        (prisma.defect.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await createDefect(req as Request, res as Response);

        expect(status).toHaveBeenCalledWith(500);
        expect(send).toHaveBeenCalledWith(expect.any(Error));
    });
});
