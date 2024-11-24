import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'unicorn': unicorn,
    },
    rules: {

      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'function',
          format: ['camelCase'],
        },
      ],

      'unicorn/filename-case': [
        'warn',
        {
          case: 'kebabCase',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_', // ข้ามตัวแปรที่ขึ้นต้นด้วย _
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'], // อนุญาตเฉพาะ console.warn และ console.error
        },
      ],
    },
  },
  {
    files: ['eslint-report.ts'], // ระบุไฟล์ที่ต้องการยกเว้น
    rules: {
      'no-console': 'off', // ปิดการตรวจสอบ no-console สำหรับไฟล์นี้
    },
  },
];
