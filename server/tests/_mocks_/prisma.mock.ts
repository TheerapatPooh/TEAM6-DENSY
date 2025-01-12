// tests/_mocks_/prisma.mock.ts
export const prismaMock = {
    patrol: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    patrolChecklist: {
        create: jest.fn(),
    },
    patrolResult: {
        create: jest.fn(),
    },
    // Mock method อื่น ๆ ที่ใช้ในโค้ดจริง
};

// ทำการ mock โมดูล prisma ใน @Utils/database.js
jest.mock('@Utils/database.js', () => {
    return {
        __esModule: true,
        default: prismaMock,
    };
});

export const createNotificationMock = jest.fn();
jest.mock('@Controllers/util-controller.js', () => ({
    __esModule: true,
    createNotification: createNotificationMock,
}));