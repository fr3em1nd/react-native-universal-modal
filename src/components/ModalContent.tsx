/**
 * ModalContent - Inner content wrapper with accessibility support
 */

import { memo, type ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle, type StyleProp, type ViewProps } from 'react-native';
import { FocusTrap } from '../accessibility/FocusTrap';
import { useAriaProps, generateAriaIds } from '../accessibility/aria';
import type { AccessibilityConfig } from '../types';
import { isWeb } from '../utils';

interface ModalContentProps {
  /** Modal content */
  children: ReactNode;
  /** Custom content style */
  style?: StyleProp<ViewStyle>;
  /** Whether to trap focus (web) */
  trapFocus?: boolean;
  /** Accessibility configuration */
  accessibilityConfig?: AccessibilityConfig;
  /** Test ID */
  testID?: string;
}

/**
 * ModalContent - Accessibility-aware content wrapper
 *
 * Features:
 * - Focus trapping (web)
 * - ARIA attributes (web)
 * - Native accessibility props
 */
export const ModalContent = memo(function ModalContent({
  children,
  style,
  trapFocus = true,
  accessibilityConfig = {},
  testID,
}: ModalContentProps): JSX.Element {
  const generatedIds = generateAriaIds('modal');

  const ariaProps = useAriaProps(accessibilityConfig, {
    titleId: accessibilityConfig.ariaLabelledBy ?? generatedIds.titleId,
    descriptionId: accessibilityConfig.ariaDescribedBy ?? generatedIds.descriptionId,
  });

  const content = (
    <View
      style={[styles.content, style]}
      testID={testID}
      accessibilityRole="alert"
      accessibilityLabel={accessibilityConfig.accessibilityLabel}
      accessibilityHint={accessibilityConfig.accessibilityHint}
      {...(isWeb ? (ariaProps as Partial<ViewProps>) : {})}
    >
      {children}
    </View>
  );

  // Wrap in FocusTrap on web
  if (trapFocus) {
    return (
      <FocusTrap
        active={trapFocus}
        config={{
          returnFocusOnDeactivate: accessibilityConfig.restoreFocus ?? true,
        }}
      >
        {content}
      </FocusTrap>
    );
  }

  return content;
});

ModalContent.displayName = 'ModalContent';

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 5,
  },
});
