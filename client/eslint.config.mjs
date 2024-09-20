import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';

export default [
  {
    files: ['/*.ts', '/*.tsx'], 
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020, 
      sourceType: 'module', 
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'unicorn': unicorn,
    },
    extends: ['next/core-web-vitals', 'next/typescript'], 
    rules: {

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'function',
          format: ['PascalCase','camelCase'],
        },
      ],

      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];