// tests/singleton.ts
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

// สร้าง mock PrismaClient
const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

// กำหนดการ mock สำหรับ '@Utils/database.js' ให้คืนค่า prismaMock
jest.mock('@Utils/database.js', () => ({
    __esModule: true,
    default: prismaMock,
}));

export { prismaMock };
