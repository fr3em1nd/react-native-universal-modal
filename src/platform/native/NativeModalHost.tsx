/**
 * NativeModalHost - Container wrapper for native modal rendering
 */

import React, { type ReactNode, memo } from 'react';
import { View, StyleSheet, Platform, type ViewStyle } from 'react-native';
import type { ModalState } from '../../types';

interface NativeModalHostProps {
  /** Modal content to render */
  children: ReactNode;
  /** Z-index for layering */
  zIndex: number;
  /** Current modal lifecycle state */
  state: ModalState;
  /** Custom container style */
  style?: ViewStyle;
}

/**
 * NativeModalHost - Wrapper for modal content on native platforms
 *
 * Features:
 * - Proper z-index and elevation for layering
 * - accessibilityViewIsModal for screen reader focus
 * - Pointer events handling based on state
 */
export const NativeModalHost = memo(function NativeModalHost({
  children,
  zIndex,
  state,
  style,
}: NativeModalHostProps): JSX.Element {
  const isExiting = state === 'exiting';

  return (
    <View
      style={[
        styles.container,
        {
          zIndex,
          // Android requires elevation for proper z-ordering
          ...(Platform.OS === 'android' && { elevation: Math.min(zIndex - 999, 24) }),
        },
        style,
      ]}
      pointerEvents={isExiting ? 'none' : 'box-none'}
      // iOS: Tell VoiceOver this is a modal
      accessibilityViewIsModal={Platform.OS === 'ios' && !isExiting}
      // Android: Ensure proper accessibility
      importantForAccessibility={isExiting ? 'no-hide-descendants' : 'yes'}
      accessibilityLiveRegion="polite"
    >
      {children}
    </View>
  );
});

NativeModalHost.displayName = 'NativeModalHost';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
