/**
 * ModalBackdrop - Backdrop/overlay for modals
 */

import React, { memo, useCallback, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Animated,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import {
  DEFAULT_BACKDROP_COLOR,
  DEFAULT_BACKDROP_OPACITY,
  DEFAULT_ANIMATION_DURATION,
} from '../core/constants';
import type { ModalState } from '../types';

interface ModalBackdropProps {
  /** Whether the backdrop is visible */
  visible: boolean;
  /** Current modal state for animation */
  state: ModalState;
  /** Callback when backdrop is pressed */
  onPress?: () => void;
  /** Backdrop color */
  color?: string;
  /** Backdrop opacity when fully visible */
  opacity?: number;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Custom backdrop style */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

/**
 * ModalBackdrop - Animated backdrop overlay
 *
 * Features:
 * - Animated opacity
 * - Press handling
 * - Customizable color and opacity
 */
export const ModalBackdrop = memo(function ModalBackdrop({
  visible,
  state,
  onPress,
  color = DEFAULT_BACKDROP_COLOR,
  opacity = DEFAULT_BACKDROP_OPACITY,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  style,
  testID,
}: ModalBackdropProps): JSX.Element | null {
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  // Animate opacity based on visibility
  React.useEffect(() => {
    const toValue = visible && state !== 'exiting' ? opacity : 0;

    Animated.timing(animatedOpacity, {
      toValue,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [visible, state, opacity, animationDuration, animatedOpacity]);

  const handlePress = useCallback(() => {
    if (onPress && state !== 'exiting') {
      onPress();
    }
  }, [onPress, state]);

  if (!visible && state === 'hidden') {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.backdrop,
        {
          backgroundColor: color,
          opacity: animatedOpacity,
        },
        style,
      ]}
      testID={testID}
    >
      <Pressable
        style={styles.pressable}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Close modal"
        accessibilityHint="Double-tap to close the modal"
      />
    </Animated.View>
  );
});

ModalBackdrop.displayName = 'ModalBackdrop';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  pressable: {
    flex: 1,
  },
});
