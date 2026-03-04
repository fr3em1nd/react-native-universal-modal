import { Platform } from 'react-native';

/**
 * Check if running on web platform
 */
export const isWeb = Platform.OS === 'web';

/**
 * Check if running on iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if running on Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Check if running on native platform (iOS or Android)
 */
export const isNative = isIOS || isAndroid;

/**
 * Get the current platform name
 */
export const platformName = Platform.OS;

/**
 * Platform-specific value selector
 */
export function selectPlatform<T>(options: {
  web?: T;
  ios?: T;
  android?: T;
  native?: T;
  default: T;
}): T {
  if (isWeb && options.web !== undefined) return options.web;
  if (isIOS && options.ios !== undefined) return options.ios;
  if (isAndroid && options.android !== undefined) return options.android;
  if (isNative && options.native !== undefined) return options.native;
  return options.default;
}
