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
          format: ['PascalCase','camelCase'],
        },
      ],
      
      'unicorn/filename-case': [
        'warn',
        {
          case: 'kebabCase',
        },
      ],
    },
  },
];
