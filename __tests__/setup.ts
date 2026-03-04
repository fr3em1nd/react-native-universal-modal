/**
 * Jest setup file
 */

import '@testing-library/react-native/extend-expect';

// react-native-reanimated is mocked via __mocks__/react-native-reanimated.ts

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((options) => options.ios ?? options.default),
}));

// Silence console warnings in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0]?.includes?.('act(...)') ||
    args[0]?.includes?.('[react-native-unified-modal]')
  ) {
    return;
  }
  originalWarn(...args);
};
