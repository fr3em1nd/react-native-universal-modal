/**
 * Jest setup file
 */

import '@testing-library/react-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

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
    args[0]?.includes?.('[react-native-universal-modal]')
  ) {
    return;
  }
  originalWarn(...args);
};
