/**
 * ModalContainer - Wrapper for modal content with animations
 */

import React, { memo, type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useAnimationEngine } from '../animation';
import type { AnimationType, AnimationConfig, ModalState } from '../types';

interface ModalContainerProps {
  /** Modal content */
  children: ReactNode;
  /** Z-index for layering */
  zIndex: number;
  /** Current modal state */
  state: ModalState;
  /** Animation type */
  animation?: AnimationType;
  /** Animation configuration */
  animationConfig?: AnimationConfig;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom content style */
  contentStyle?: StyleProp<ViewStyle>;
  /** Callback when animation completes */
  onAnimationComplete?: (state: ModalState) => void;
}

/**
 * ModalContainer - Animated container for modal content
 *
 * Features:
 * - Centered content positioning
 * - Animation integration
 * - Z-index management
 */
export const ModalContainer = memo(function ModalContainer({
  children,
  zIndex,
  state,
  animation = 'fade',
  animationConfig,
  style,
  contentStyle,
  onAnimationComplete,
}: ModalContainerProps): JSX.Element {
  const { animatedStyle, animateIn, animateOut, isAnimating } = useAnimationEngine({
    animation,
    config: animationConfig,
  });

  // Handle animation based on state changes
  React.useEffect(() => {
    if (state === 'entering') {
      animateIn(() => {
        onAnimationComplete?.('visible');
      });
    } else if (state === 'exiting') {
      animateOut(() => {
        onAnimationComplete?.('hidden');
      });
    }
  }, [state, animateIn, animateOut, onAnimationComplete]);

  return (
    <View
      style={[
        styles.container,
        { zIndex },
        style,
      ]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          styles.content,
          contentStyle,
          animatedStyle,
        ]}
        pointerEvents={isAnimating && state === 'exiting' ? 'none' : 'auto'}
      >
        {children}
      </Animated.View>
    </View>
  );
});

ModalContainer.displayName = 'ModalContainer';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  content: {
    maxWidth: '90%',
    maxHeight: '80%',
  },
});
