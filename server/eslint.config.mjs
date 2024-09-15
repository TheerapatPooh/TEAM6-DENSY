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
        'error',
        {
          selector: 'function',
          format: ['camelCase'],
        },
      ],
      
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
    },
  },
];
