import { useMemo } from 'react';
import type {
  AnimationPresetConfig,
  AnimationConfig,
  UseAnimationEngineReturn,
  AnimationType,
} from '../../types';
import { useAnimatedEngine } from './AnimatedEngine';
import { useReanimatedEngine, isReanimatedAvailable } from './ReanimatedEngine';
import { getPreset } from '../presets';

/**
 * Options for useAnimationEngine hook
 */
export interface UseAnimationEngineOptions {
  /** Animation type (preset name or custom animation) */
  animation?: AnimationType;
  /** Animation configuration overrides */
  config?: AnimationConfig;
  /** Force a specific engine */
  forceEngine?: 'reanimated' | 'animated';
}

/**
 * Hook to get the appropriate animation engine
 *
 * Automatically selects between react-native-reanimated (preferred)
 * and React Native's Animated API (fallback)
 */
export function useAnimationEngine(
  options: UseAnimationEngineOptions = {}
): UseAnimationEngineReturn {
  const { animation = 'fade', config, forceEngine } = options;

  // Get the preset configuration
  const preset = useMemo((): AnimationPresetConfig => {
    if (typeof animation === 'string') {
      return getPreset(animation);
    }
    // Custom animation - convert to preset format
    return {
      enter: animation.from,
      exit: animation.to,
      config: {
        duration: animation.duration,
        easing: animation.easing,
      },
    };
  }, [animation]);

  // Determine which engine to use
  const useReanimated = useMemo(() => {
    if (forceEngine === 'animated') return false;
    if (forceEngine === 'reanimated') return true;
    return isReanimatedAvailable();
  }, [forceEngine]);

  // Use the appropriate engine
  // Note: We need to call both hooks but only use one result
  // This is because hooks must be called unconditionally
  const animatedResult = useAnimatedEngine(preset, config);

  // Only try reanimated if available
  let reanimatedResult: UseAnimationEngineReturn | null = null;
  try {
    if (useReanimated && isReanimatedAvailable()) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      reanimatedResult = useReanimatedEngine(preset, config);
    }
  } catch {
    // Fallback to animated if reanimated fails
  }

  return reanimatedResult ?? animatedResult;
}

/**
 * Check if the preferred animation engine (reanimated) is available
 */
export { isReanimatedAvailable };
