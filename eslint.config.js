const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const reactPlugin = require('eslint-plugin-react');
const hooksPlugin = require('eslint-plugin-react-hooks');
const reactNativePlugin = require('eslint-plugin-react-native');
const importPlugin = require('eslint-plugin-import');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');

const currentDirectory = __dirname;

const trimGlobalKeys = globalsObject => {
  if (!globalsObject) return {};
  const newGlobals = {};
  for (const key in globalsObject) {
    if (Object.prototype.hasOwnProperty.call(globalsObject, key)) {
      newGlobals[key.trim()] = globalsObject[key];
    }
  }
  return newGlobals;
};

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.expo/',
      'android/',
      'ios/',
      'web-build/',
      '**/*.config.js',
      '.eslintrc.js',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    // Register plugins
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      'react-native': reactNativePlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest', // Use latest ECMAScript version
        sourceType: 'module', // Treat source files as ECMAScript modules
        project: './tsconfig.json', // Path to TypeScript configuration
        ecmaFeatures: {
          jsx: true, // Enable JSX syntax support
        },
      },
      globals: {
        ...trimGlobalKeys(globals.browser),
        ...trimGlobalKeys(globals.node),
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          paths: ['src'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      node: true,
    },
    rules: {
      // Base recommended rules
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      ...reactNativePlugin.configs.all.rules,
      ...importPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn on console.log but allow console.warn and console.error
      'no-unused-vars': 'off', // Disable ESLint unused vars check in favor of TypeScript's
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ], // Error on unused vars except those starting with underscore

      // React rules
      'react/react-in-jsx-scope': 'off', // Don't require React import in JSX files (not needed in React 17+)
      'react/prop-types': 'off', // Don't require prop-types as we use TypeScript
      'react/jsx-uses-react': 'off', // Not needed in React 17+ with new JSX transform

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

      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',

      // Environment-specific rules
      'no-process-env': 'off', // Allow process.env for react-native-dotenv support
    },
  },
  // Special rules for expo-router files
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      // Allow underscore-prefixed files (required by expo-router)
      'react/display-name': 'off',
      // Allow more flexible component naming in route files
      'react/function-component-definition': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },
  prettierConfig,
);
