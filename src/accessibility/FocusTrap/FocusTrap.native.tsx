/**
 * FocusTrap - Native implementation
 * On native platforms, we use accessibilityViewIsModal instead of manual focus trapping
 */

import React, { type ReactNode } from 'react';
import { View, Platform, type ViewProps } from 'react-native';
import type { FocusTrapConfig } from '../../types';

export interface FocusTrapProps extends ViewProps {
  /** Whether the focus trap is active */
  active?: boolean;
  /** Focus trap configuration */
  config?: FocusTrapConfig;
  /** Children to render inside the focus trap */
  children: ReactNode;
}

/**
 * FocusTrap component for native platforms
 * Uses native accessibility features instead of manual focus management
 *
 * - iOS: accessibilityViewIsModal={true} tells VoiceOver to only focus on modal content
 * - Android: importantForAccessibility="yes" with proper role
 */
export function FocusTrap({
  active = true,
  children,
  config: _config,
  ...viewProps
}: FocusTrapProps): JSX.Element {
  return (
    <View
      {...viewProps}
      // iOS: Tell VoiceOver this is a modal view
      accessibilityViewIsModal={Platform.OS === 'ios' && active}
      // Android: Ensure this view tree is accessible
      importantForAccessibility={active ? 'yes' : 'auto'}
      // Mark as a dialog/modal for screen readers
      accessibilityRole="alert"
    >
      {children}
    </View>
  );
}

FocusTrap.displayName = 'FocusTrap';
