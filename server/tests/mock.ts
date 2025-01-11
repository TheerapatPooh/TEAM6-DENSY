// tests/mock.ts
import { prismaMock } from './_mocks_/prisma.mock';
import { mockReset } from 'jest-mock-extended';

beforeEach(() => {
    mockReset(prismaMock); // Reset Mock ก่อนแต่ละ Test
});

export { prismaMock };
