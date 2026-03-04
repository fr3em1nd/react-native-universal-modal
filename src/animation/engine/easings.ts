import { Easing } from 'react-native';
import type { EasingName, EasingFunction } from '../../types';

/**
 * Easing function implementations
 */
export const easings: Record<EasingName, EasingFunction> = {
  linear: (t: number) => t,

  easeIn: (t: number) => t * t,

  easeOut: (t: number) => t * (2 - t),

  easeInOut: (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  easeInQuad: (t: number) => t * t,

  easeOutQuad: (t: number) => t * (2 - t),

  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  easeInCubic: (t: number) => t * t * t,

  easeOutCubic: (t: number) => {
    const t1 = t - 1;
    return t1 * t1 * t1 + 1;
  },

  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  easeInBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },

  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  easeInOutBack: (t: number) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
};

/**
 * Get an easing function by name or return the function itself
 */
export function getEasing(easing?: EasingName | EasingFunction): EasingFunction {
  if (typeof easing === 'function') {
    return easing;
  }
  return easings[easing ?? 'easeOut'] ?? easings.easeOut;
}

/**
 * Get React Native Easing object for Animated API
 */
export function getAnimatedEasing(easing?: EasingName | EasingFunction) {
  if (typeof easing === 'function') {
    return Easing.bezier(0.25, 0.1, 0.25, 1); // Default cubic bezier
  }

  const easingMap: Partial<Record<EasingName, ReturnType<typeof Easing.bezier>>> = {
    linear: Easing.linear,
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeInOut: Easing.inOut(Easing.ease),
    easeInQuad: Easing.in(Easing.quad),
    easeOutQuad: Easing.out(Easing.quad),
    easeInOutQuad: Easing.inOut(Easing.quad),
    easeInCubic: Easing.in(Easing.cubic),
    easeOutCubic: Easing.out(Easing.cubic),
    easeInOutCubic: Easing.inOut(Easing.cubic),
    easeInBack: Easing.in(Easing.back(1.70158)),
    easeOutBack: Easing.out(Easing.back(1.70158)),
    easeInOutBack: Easing.inOut(Easing.back(1.70158)),
  };

  return easingMap[easing ?? 'easeOut'] ?? Easing.out(Easing.ease);
}
