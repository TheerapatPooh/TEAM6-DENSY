import { PrismaClient } from '@prisma/client';

declare global {
  var __PRISMA_CLIENT__: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (!global.__PRISMA_CLIENT__) {
  prisma = new PrismaClient();
  global.__PRISMA_CLIENT__ = prisma;
} else {
  prisma = global.__PRISMA_CLIENT__;
}

export default prisma;
