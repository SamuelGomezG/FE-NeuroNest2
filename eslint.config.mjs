import typescriptEslint from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url); // Convert the current module URL to a filesystem path
const __dirname = path.dirname(__filename); // Get the directory name of the current file

// Create a compatibility layer for traditional ESLint configs in the new flat config system
const compat = new FlatCompat({
  baseDirectory: __dirname, // Set the base directory for resolving relative paths
  recommendedConfig: js.configs.recommended, // Use ESLint's recommended configuration
  allConfig: js.configs.all, // Include all ESLint configurations
});

/**
 * ESLint configuration for a React Native project with TypeScript.
 *
 * This configuration:
 * - Extends recommended configs for ESLint, TypeScript, React, and React Native
 * - Integrates with Prettier to avoid formatting conflicts
 * - Sets up appropriate parser options for TypeScript and JSX
 * - Defines custom rules for React Native and TypeScript development
 * - Ignores common build directories and configuration files
 *
 * @module eslint.config
 * @exports {Array} - Default ESLint configuration array for the project
 */
export default [
  ...compat.extends(
    // Include recommended or necessary rulesets
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
  ),
  {
    // Register necessary plugins
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react,
      'react-native': reactNative,
      'react-hooks': reactHooks,
      'import': eslintImport,
      'prettier': eslintPluginPrettier
    },
    languageOptions: {
      parser: tsParser, // Use TypeScript parser for parsing code
      parserOptions: {
        ecmaVersion: 'latest', // Use latest ECMAScript version
        sourceType: 'module', // Treat source files as ECMAScript modules
        project: './tsconfig.json', // Path to TypeScript configuration
        ecmaFeatures: {
          jsx: true, // Enable JSX syntax support
        },
      },
      // Enable React Native and Node.js environments and ES2022 features
      globals: {
        'react-native/react-native': true,
        es2022: true,
        node: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          paths: ['src']
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn on console.log but allow console.warn and console.error
      'no-unused-vars': 'off', // Disable ESLint unused vars check in favor of TypeScript's
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }], // Error on unused vars except those starting with underscore

      // React rules
      'react/react-in-jsx-scope': 'off', // Don't require React import in JSX files (not needed in React 17+)
      'react/prop-types': 'off', // Don't require prop-types as we use TypeScript
      'react/jsx-uses-react': 'off', // Not needed in React 17+ with new JSX transform

      // React hooks rules - important for functional components
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Native rules
      'react-native/no-raw-text': ['error', { skip: ['Text'] }], // Enforce using Text component except in specified components
      'react-native/no-unused-styles': 'error', // Error on unused StyleSheet styles
      'react-native/split-platform-components': 'error', // Error when platform-specific components aren't split properly
      'react-native/no-inline-styles': 'warn', // Warn instead of error for prototype
      'react-native/no-color-literals': 'warn', // Warn instead of error for prototype

      // Accessibility - important but warn-only for prototype
      'react-native/no-single-element-style-arrays': 'warn',
      
      // TypeScript rules
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Don't require explicit return types on functions
      '@typescript-eslint/no-explicit-any': 'warn', // Warn when 'any' type is used
      '@typescript-eslint/ban-ts-comment': 'warn', // Warn on TypeScript directive comments like @ts-ignore
      '@typescript-eslint/no-non-null-assertion': 'warn', // Allow but warn about non-null assertions
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],

      // Import ordering - helps maintain organized code
      'import/order': ['warn', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' }
      }],
      
      // Environment-specific rules
      'no-process-env': 'off', // Allow process.env for react-native-dotenv support
    },
    // Ignore directories and files that don't require checking
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.expo/',
      'web-build/',
      '*.config.js',
      'eslint.config.mjs',
      '.eslintrc.js',
    ],
  },
  // Special rules for expo-router files
  {
    files: ['src/app/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
    rules: {
      // Allow underscore-prefixed files (required by expo-router)
      'react/display-name': 'off',
      // Allow more flexible component naming in route files
      'react/function-component-definition': 'off',
      'import/no-anonymous-default-export': 'off',
    }
  }
];
