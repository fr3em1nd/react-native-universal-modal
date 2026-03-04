import { useRef, useCallback, useState } from 'react';
import { Animated, type ViewStyle } from 'react-native';
import type {
  AnimationPresetConfig,
  AnimationConfig,
  AnimationState,
  UseAnimationEngineReturn,
} from '../../types';
import { getAnimatedEasing } from './easings';
import { DEFAULT_ANIMATION_DURATION } from '../../core/constants';

/**
 * Interpolate a value based on progress
 */
function interpolateValue(
  progress: Animated.Value,
  from: number | undefined,
  to: number | undefined,
  defaultValue: number
): Animated.AnimatedInterpolation<number> {
  const fromVal = from ?? defaultValue;
  const toVal = to ?? defaultValue;

  return progress.interpolate({
    inputRange: [0, 1],
    outputRange: [fromVal, toVal],
    extrapolate: 'clamp',
  });
}

/**
 * Animation engine using React Native's Animated API
 * Used as fallback when react-native-reanimated is not available
 */
export function useAnimatedEngine(
  preset: AnimationPresetConfig,
  config?: AnimationConfig
): UseAnimationEngineReturn {
  const progress = useRef(new Animated.Value(0)).current;
  const [animationState, setAnimationState] = useState<AnimationState>('exited');
  const [isAnimating, setIsAnimating] = useState(false);

  const duration = config?.duration ?? preset.config?.duration ?? DEFAULT_ANIMATION_DURATION;
  const delay = config?.delay ?? preset.config?.delay ?? 0;
  const easing = config?.easing ?? preset.config?.easing ?? 'easeOut';

  const animateIn = useCallback(
    (callback?: () => void) => {
      setAnimationState('entering');
      setIsAnimating(true);

      Animated.timing(progress, {
        toValue: 1,
        duration,
        delay,
        easing: getAnimatedEasing(easing),
        useNativeDriver: config?.useNativeDriver ?? true,
      }).start(({ finished }) => {
        if (finished) {
          setAnimationState('entered');
          setIsAnimating(false);
          callback?.();
        }
      });
    },
    [progress, duration, delay, easing, config?.useNativeDriver]
  );

  const animateOut = useCallback(
    (callback?: () => void) => {
      setAnimationState('exiting');
      setIsAnimating(true);

      Animated.timing(progress, {
        toValue: 0,
        duration,
        easing: getAnimatedEasing(easing),
        useNativeDriver: config?.useNativeDriver ?? true,
      }).start(({ finished }) => {
        if (finished) {
          setAnimationState('exited');
          setIsAnimating(false);
          callback?.();
        }
      });
    },
    [progress, duration, easing, config?.useNativeDriver]
  );

  // Build animated style
  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = {
    opacity: interpolateValue(progress, preset.enter.opacity, preset.exit.opacity, 1),
    transform: [
      {
        translateX: interpolateValue(
          progress,
          preset.enter.translateX,
          preset.exit.translateX,
          0
        ),
      },
      {
        translateY: interpolateValue(
          progress,
          preset.enter.translateY,
          preset.exit.translateY,
          0
        ),
      },
      {
        scale: interpolateValue(progress, preset.enter.scale, preset.exit.scale, 1),
      },
    ],
  };

  // Handle rotation separately (needs string output)
  if (preset.enter.rotate !== undefined || preset.exit.rotate !== undefined) {
    const rotateInterpolation = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [
        `${preset.enter.rotate ?? 0}deg`,
        `${preset.exit.rotate ?? 0}deg`,
      ],
      extrapolate: 'clamp',
    });

    (animatedStyle.transform as Animated.WithAnimatedArray<ViewStyle['transform']>)?.push({
      rotate: rotateInterpolation,
    } as unknown as Animated.WithAnimatedObject<ViewStyle['transform']>[number]);
  }

  return {
    animatedStyle: animatedStyle as unknown as ViewStyle,
    animateIn,
    animateOut,
    state: animationState,
    isAnimating,
  };
}

/**
 * Create an Animated.View wrapper component
 */
export function createAnimatedContainer() {
  return Animated.View;
}
