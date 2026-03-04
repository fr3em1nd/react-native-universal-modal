/**
 * useBackHandler - Android-only hook for handling hardware back button
 */

import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import type { UseBackHandlerOptions } from '../../types';

/**
 * Hook to handle Android hardware back button
 *
 * @param options.enabled - Whether the handler is active
 * @param options.onBack - Callback when back button is pressed.
 *                         Return true to prevent default behavior (going back)
 */
export function useBackHandler({ enabled = true, onBack }: UseBackHandlerOptions): void {
  useEffect(() => {
    // Only attach on Android platform
    if (Platform.OS !== 'android' || !enabled) return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);

    return () => {
      subscription.remove();
    };
  }, [enabled, onBack]);
}
