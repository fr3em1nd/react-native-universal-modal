/**
 * Throw an error if the condition is false
 * Used for runtime assertions that should never fail in production
 * @param condition - Condition to check
 * @param message - Error message if condition is false
 */
export function invariant(
  condition: unknown,
  message: string
): asserts condition {
  if (!condition) {
    throw new Error(`[react-native-universal-modal] ${message}`);
  }
}

/**
 * Log a warning in development mode
 * @param condition - Condition to check
 * @param message - Warning message if condition is false
 */
export function warning(condition: unknown, message: string): void {
  if (!condition && __DEV__) {
    console.warn(`[react-native-universal-modal] ${message}`);
  }
}

/**
 * Check if running in development mode
 */
declare const __DEV__: boolean | undefined;
