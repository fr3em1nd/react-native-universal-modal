module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*\\.(test|spec)|\\.(test|spec))\\.(ts|tsx)$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/lib/',
    '/__tests__/utils/',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-reanimated|@react-native-community)/)',
  ],
  moduleNameMapper: {
    '^react-native-unified-modal$': '<rootDir>/src/index.ts',
    '^react-native-unified-modal/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testEnvironment: 'node',
  globals: {
    __DEV__: true,
  },
};
