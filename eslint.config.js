// @ts-check
const eslint = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const angularPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const globals = require('globals');

module.exports = [
  {
    // Global ignores
    ignores: ['projects/**/*', 'dist/**/*', 'node_modules/**/*', 'coverage/**/*', '**/*.js'],
  },
  {
    // TypeScript files configuration (non-test)
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': angularPlugin,
    },
    rules: {
      // Base ESLint recommended rules
      ...eslint.configs.recommended.rules,
      
      // TypeScript recommended rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-namespace': 'warn',
      
      // Turn off base rules that are handled by TypeScript
      'no-undef': 'off',
      'no-unused-vars': 'off',
      
      // Angular-specific rules
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'dir',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/contextual-lifecycle': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',
    },
  },
  {
    // TypeScript test files configuration
    files: ['**/*.spec.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.spec.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jasmine,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': angularPlugin,
    },
    rules: {
      // Base ESLint recommended rules
      ...eslint.configs.recommended.rules,
      
      // TypeScript rules for test files
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-empty-function': 'off',
      
      // Turn off base rules that are handled by TypeScript
      'no-undef': 'off',
      'no-unused-vars': 'off',
      
      // Angular rules
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-standalone': 'off',
    },
  },
  {
    // HTML template files configuration
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    rules: {
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
    },
  }
];
