// preset.test.ts

import { Request, Response } from 'express';
import { prisma } from '@Utils/database';
import { getAllPresets } from '@Controllers/preset-controller'; // Adjust the import path accordingly
import { jest } from "@jest/globals";

jest.mock('@Utils/database', () => ({
    prisma: {
        preset: {
            findMany: jest.fn(),
        },
    },
}));

describe('Preset Controller', () => {
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
            send, // Ensure send is directly on res as well
        } as Partial<Response>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllPresets', () => {
        it('should return all presets if found', async () => {
            req = {} as Partial<Request>;

            const mockPresets = [
                {
                    ps_id: 1,
                    ps_title: 'Test Preset 1',
                    checklist: [
                        {
                            cl_id: 1,
                            checklist: {
                                cl_title: 'Checklist 1',
                            },
                        },
                    ],
                },
                {
                    ps_id: 2,
                    ps_title: 'Test Preset 2',
                    checklist: [
                        {
                            cl_id: 2,
                            checklist: {
                                cl_title: 'Checklist 2',
                            },
                        },
                    ],
                },
            ];

            (prisma.preset.findMany as jest.Mock).mockResolvedValue(mockPresets);

            await getAllPresets(req as Request, res as Response);

            expect(res.send).toHaveBeenCalledWith(mockPresets); // Check if send was called with the presets
            expect(res.status).not.toHaveBeenCalled(); // Ensure status was not called
        });

        it('should return 404 if no presets found', async () => {
            req = {} as Partial<Request>;

            (prisma.preset.findMany as jest.Mock).mockResolvedValue([]);

            await getAllPresets(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404); // Check if status was set to 404
            expect(res.send).toHaveBeenCalledWith('No presets found'); // Check if send was called with the message
        });

        it('should return 500 on error', async () => {
            req = {} as Partial<Request>;

            (prisma.preset.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

            await getAllPresets(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500); // Check if status was set to 500
            expect(res.send).toHaveBeenCalledWith(expect.any(Error)); // Check if send was called with the error
        });
    });
});
