import type { Config } from 'jest';

const config: Config = {
  transform: {
    "\\.[jt]sx?$": ["ts-jest", { "useESM": true }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@Controllers/(.*)\\.js$": "<rootDir>/src/Controllers/$1.ts",
    "^@Routes/(.*)\\.js$": "<rootDir>/src/Routes/$1.ts",
    "^@Utils/(.*)\\.js$": "<rootDir>/src/Utils/$1.ts", 
    "^@Tests/(.*)$": "<rootDir>/Tests/$1",
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/Tests/_mocks_/prisma.mock.ts'],
};

export default config;
