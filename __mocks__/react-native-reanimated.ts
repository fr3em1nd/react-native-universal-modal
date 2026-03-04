/**
 * Mock for react-native-reanimated
 */

const Reanimated = {
  useSharedValue: jest.fn((init: unknown) => ({ value: init })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((toValue: number) => toValue),
  withDelay: jest.fn((_: number, animation: number) => animation),
  runOnJS: jest.fn(<T extends (...args: unknown[]) => unknown>(fn: T) => fn),
  Easing: {
    linear: {},
    ease: {},
    in: jest.fn(),
    out: jest.fn(),
    inOut: jest.fn(),
  },
  interpolate: jest.fn((_progress: number, _inputRange: number[], outputRange: number[]) => outputRange[0]),
};

export default Reanimated;
export const {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
  interpolate,
} = Reanimated;
