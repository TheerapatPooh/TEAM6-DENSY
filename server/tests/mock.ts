// tests/mock.ts
import { prismaMock } from './_mocks_/prisma.mock';
import { mockReset } from 'jest-mock-extended';

jest.mock('@Utils/database.js', () => ({
    __esModule: true,
    default: prismaMock, // ใช้ Prisma Mock แทนของจริง
}));

beforeEach(() => {
    mockReset(prismaMock); // Reset Mock ก่อนแต่ละ Test
});

export { prismaMock };
