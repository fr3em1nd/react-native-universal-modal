/**
 * Animation engine using react-native-reanimated
 * This provides better performance through worklet-based animations
 *
 * NOTE: This file requires react-native-reanimated to be installed.
 * The library gracefully falls back to AnimatedEngine if reanimated is not available.
 */

import { useCallback, useState } from 'react';
import type {
  AnimationPresetConfig,
  AnimationConfig,
  AnimationState,
  UseAnimationEngineReturn,
} from '../../types';
import { DEFAULT_ANIMATION_DURATION } from '../../core/constants';

// Type-only imports for reanimated
// These will be dynamically imported at runtime
type SharedValue<T> = { value: T };
type AnimatedStyle = Record<string, unknown>;

// Check if reanimated is available
let reanimatedAvailable = false;
let Reanimated: {
  useSharedValue: <T>(initialValue: T) => SharedValue<T>;
  useAnimatedStyle: (updater: () => AnimatedStyle) => AnimatedStyle;
  withTiming: (
    toValue: number,
    config?: { duration?: number; easing?: unknown },
    callback?: (finished: boolean) => void
  ) => number;
  withDelay: (delay: number, animation: number) => number;
  runOnJS: <T extends (...args: unknown[]) => unknown>(fn: T) => T;
  Easing: {
    linear: unknown;
    ease: unknown;
    in: (easing: unknown) => unknown;
    out: (easing: unknown) => unknown;
    inOut: (easing: unknown) => unknown;
  };
  interpolate: (
    progress: number,
    inputRange: number[],
    outputRange: number[]
  ) => number;
} | null = null;

try {
  // Dynamic require to avoid bundling issues
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Reanimated = require('react-native-reanimated');
  reanimatedAvailable = true;
} catch {
  reanimatedAvailable = false;
}

/**
 * Check if react-native-reanimated is available
 */
export function isReanimatedAvailable(): boolean {
  return reanimatedAvailable;
}

/**
 * Get easing function for Reanimated
 */
function getReanimatedEasing(easing?: string) {
  if (!Reanimated) return undefined;

  const { Easing } = Reanimated;
  const easingMap: Record<string, unknown> = {
    linear: Easing.linear,
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeInOut: Easing.inOut(Easing.ease),
  };

  return easingMap[easing ?? 'easeOut'] ?? Easing.out(Easing.ease);
}

/**
 * Animation engine using react-native-reanimated
 * Provides smoother animations through worklets
 */
export function useReanimatedEngine(
  preset: AnimationPresetConfig,
  config?: AnimationConfig
): UseAnimationEngineReturn {
  const [animationState, setAnimationState] = useState<AnimationState>('exited');
  const [isAnimating, setIsAnimating] = useState(false);

  if (!Reanimated) {
    throw new Error(
      'react-native-reanimated is not available. ' +
        'Please install it or use the fallback AnimatedEngine.'
    );
  }

  const { useSharedValue, useAnimatedStyle, withTiming, withDelay, runOnJS, interpolate } =
    Reanimated;

  const progress = useSharedValue(0);
  const duration = config?.duration ?? preset.config?.duration ?? DEFAULT_ANIMATION_DURATION;
  const delay = config?.delay ?? preset.config?.delay ?? 0;
  const easing = config?.easing ?? preset.config?.easing ?? 'easeOut';

  const animateIn = useCallback(
    (callback?: () => void) => {
      setAnimationState('entering');
      setIsAnimating(true);

      const onComplete = (finished: boolean) => {
        'worklet';
        if (finished) {
          runOnJS(setAnimationState)('entered');
          runOnJS(setIsAnimating)(false);
          if (callback) {
            runOnJS(callback)();
          }
        }
      };

      const animation = withTiming(
        1,
        {
          duration,
          easing: getReanimatedEasing(typeof easing === 'string' ? easing : 'easeOut'),
        },
        onComplete
      );

      progress.value = delay > 0 ? withDelay(delay, animation) : animation;
    },
    [progress, duration, delay, easing, runOnJS, withTiming, withDelay]
  );

  const animateOut = useCallback(
    (callback?: () => void) => {
      setAnimationState('exiting');
      setIsAnimating(true);

      const onComplete = (finished: boolean) => {
        'worklet';
        if (finished) {
          runOnJS(setAnimationState)('exited');
          runOnJS(setIsAnimating)(false);
          if (callback) {
            runOnJS(callback)();
          }
        }
      };

      progress.value = withTiming(
        0,
        {
          duration,
          easing: getReanimatedEasing(typeof easing === 'string' ? easing : 'easeOut'),
        },
        onComplete
      );
    },
    [progress, duration, easing, runOnJS, withTiming]
  );

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const p = progress.value;

    return {
      opacity: interpolate(
        p,
        [0, 1],
        [preset.enter.opacity ?? 0, preset.exit.opacity ?? 1]
      ),
      transform: [
        {
          translateX: interpolate(
            p,
            [0, 1],
            [preset.enter.translateX ?? 0, preset.exit.translateX ?? 0]
          ),
        },
        {
          translateY: interpolate(
            p,
            [0, 1],
            [preset.enter.translateY ?? 0, preset.exit.translateY ?? 0]
          ),
        },
        {
          scale: interpolate(
            p,
            [0, 1],
            [preset.enter.scale ?? 1, preset.exit.scale ?? 1]
          ),
        },
        {
          rotate: `${interpolate(
            p,
            [0, 1],
            [preset.enter.rotate ?? 0, preset.exit.rotate ?? 0]
          )}deg`,
        },
      ],
    };
  });

  return {
    animatedStyle: animatedStyle as unknown as Record<string, unknown>,
    animateIn,
    animateOut,
    state: animationState,
    isAnimating,
  };
}
