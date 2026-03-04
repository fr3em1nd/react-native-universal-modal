import type { ViewStyle } from 'react-native';

/**
 * Named animation presets
 */
export type AnimationPresetName =
  | 'none'
  | 'fade'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scale'
  | 'bounce'
  | 'spring';

/**
 * Custom animation definition
 */
export interface CustomAnimation {
  /** Starting animation state */
  from: AnimationValues;
  /** Ending animation state */
  to: AnimationValues;
  /** Easing function */
  easing?: EasingName | EasingFunction;
  /** Duration in milliseconds */
  duration?: number;
}

/**
 * Animation type - either a preset name or custom animation
 */
export type AnimationType = AnimationPresetName | CustomAnimation;

/**
 * Animation values that can be animated
 */
export interface AnimationValues {
  /** Opacity (0-1) */
  opacity?: number;
  /** X translation in pixels */
  translateX?: number;
  /** Y translation in pixels */
  translateY?: number;
  /** Scale factor */
  scale?: number;
  /** Rotation in degrees */
  rotate?: number;
}

/**
 * Named easing functions
 */
export type EasingName =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack';

/**
 * Custom easing function (0-1 input, 0-1 output)
 */
export type EasingFunction = (t: number) => number;

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Duration in milliseconds */
  duration?: number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** Easing function name or custom function */
  easing?: EasingName | EasingFunction;
  /** Use native driver for performance (RN Animated only) */
  useNativeDriver?: boolean;
}

/**
 * Animation preset configuration
 */
export interface AnimationPresetConfig {
  /** Values at the start of enter animation / end of exit animation */
  enter: AnimationValues;
  /** Values at the end of enter animation / start of exit animation */
  exit: AnimationValues;
  /** Default animation config for this preset */
  config?: AnimationConfig;
}

/**
 * Animation lifecycle state
 */
export type AnimationState = 'entering' | 'entered' | 'exiting' | 'exited';

/**
 * Animation engine interface
 */
export interface AnimationEngine {
  /** Whether this engine is available (e.g., reanimated installed) */
  isAvailable: boolean;
  /** Create animated style based on progress */
  createAnimatedStyle: (
    progress: number,
    preset: AnimationPresetConfig
  ) => ViewStyle;
  /** Animate to a target value */
  animateTo: (
    toValue: number,
    config: AnimationConfig,
    callback?: (finished: boolean) => void
  ) => void;
  /** Get current animation progress */
  getProgress: () => number;
  /** Reset animation to initial state */
  reset: () => void;
  /** Stop current animation */
  stop: () => void;
}

/**
 * Options for useAnimationEngine hook
 */
export interface UseAnimationEngineOptions {
  /** Animation preset configuration */
  preset: AnimationPresetConfig;
  /** Animation configuration overrides */
  config?: AnimationConfig;
  /** Force a specific engine ('reanimated' | 'animated') */
  forceEngine?: 'reanimated' | 'animated';
}

/**
 * Return type for useAnimationEngine hook
 */
export interface UseAnimationEngineReturn {
  /** Animated style to apply to the modal */
  animatedStyle: ViewStyle;
  /** Trigger enter animation */
  animateIn: (callback?: () => void) => void;
  /** Trigger exit animation */
  animateOut: (callback?: () => void) => void;
  /** Current animation state */
  state: AnimationState;
  /** Whether animation is in progress */
  isAnimating: boolean;
}

/**
 * Shared transition configuration
 */
export interface SharedTransitionConfig {
  /** Transition type */
  type: 'crossfade' | 'slide' | 'morph' | 'custom';
  /** Duration in milliseconds */
  duration?: number;
  /** Easing function */
  easing?: EasingName | EasingFunction;
  /** Custom transition function */
  customTransition?: (
    fromProgress: number,
    toProgress: number
  ) => { from: ViewStyle; to: ViewStyle };
}

/**
 * Modal animation state for shared transitions
 */
export interface ModalAnimationState {
  /** Modal ID */
  id: string;
  /** Animation progress (0-1) */
  progress: number;
  /** Position and size */
  position: { x: number; y: number; width: number; height: number };
  /** Current opacity */
  opacity: number;
}
