import type { AnimationPresetConfig, AnimationPresetName } from '../../types';
import { Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * No animation preset
 */
export const nonePreset: AnimationPresetConfig = {
  enter: { opacity: 1, translateY: 0, scale: 1 },
  exit: { opacity: 1, translateY: 0, scale: 1 },
  config: { duration: 0 },
};

/**
 * Fade animation preset
 */
export const fadePreset: AnimationPresetConfig = {
  enter: { opacity: 0 },
  exit: { opacity: 1 },
  config: { duration: 200, easing: 'easeOut' },
};

/**
 * Slide up animation preset
 */
export const slideUpPreset: AnimationPresetConfig = {
  enter: { opacity: 0, translateY: SCREEN_HEIGHT * 0.3 },
  exit: { opacity: 1, translateY: 0 },
  config: { duration: 300, easing: 'easeOut' },
};

/**
 * Slide down animation preset
 */
export const slideDownPreset: AnimationPresetConfig = {
  enter: { opacity: 0, translateY: -SCREEN_HEIGHT * 0.3 },
  exit: { opacity: 1, translateY: 0 },
  config: { duration: 300, easing: 'easeOut' },
};

/**
 * Slide left animation preset
 */
export const slideLeftPreset: AnimationPresetConfig = {
  enter: { opacity: 0, translateX: SCREEN_WIDTH },
  exit: { opacity: 1, translateX: 0 },
  config: { duration: 300, easing: 'easeOut' },
};

/**
 * Slide right animation preset
 */
export const slideRightPreset: AnimationPresetConfig = {
  enter: { opacity: 0, translateX: -SCREEN_WIDTH },
  exit: { opacity: 1, translateX: 0 },
  config: { duration: 300, easing: 'easeOut' },
};

/**
 * Scale animation preset
 */
export const scalePreset: AnimationPresetConfig = {
  enter: { opacity: 0, scale: 0.85 },
  exit: { opacity: 1, scale: 1 },
  config: { duration: 250, easing: 'easeOut' },
};

/**
 * Bounce animation preset
 */
export const bouncePreset: AnimationPresetConfig = {
  enter: { opacity: 0, scale: 0.3, translateY: -50 },
  exit: { opacity: 1, scale: 1, translateY: 0 },
  config: { duration: 400, easing: 'easeOutBack' },
};

/**
 * Spring animation preset
 */
export const springPreset: AnimationPresetConfig = {
  enter: { opacity: 0, scale: 0.8, translateY: 20 },
  exit: { opacity: 1, scale: 1, translateY: 0 },
  config: { duration: 350, easing: 'easeOutBack' },
};

/**
 * Registry of all animation presets
 */
const presetRegistry: Record<string, AnimationPresetConfig> = {
  none: nonePreset,
  fade: fadePreset,
  slideUp: slideUpPreset,
  slideDown: slideDownPreset,
  slideLeft: slideLeftPreset,
  slideRight: slideRightPreset,
  scale: scalePreset,
  bounce: bouncePreset,
  spring: springPreset,
};

/**
 * Get an animation preset by name
 * @param name - Preset name
 * @returns Animation preset configuration
 */
export function getPreset(name: AnimationPresetName | string): AnimationPresetConfig {
  const preset = presetRegistry[name];
  if (!preset) {
    console.warn(
      `[react-native-universal-modal] Unknown animation preset: "${name}". ` +
        `Using "fade" as fallback. Available presets: ${Object.keys(presetRegistry).join(', ')}`
    );
    return fadePreset;
  }
  return preset;
}

/**
 * Register a custom animation preset
 * @param name - Name for the preset
 * @param preset - Animation preset configuration
 */
export function registerPreset(name: string, preset: AnimationPresetConfig): void {
  if (presetRegistry[name]) {
    console.warn(
      `[react-native-universal-modal] Overwriting existing preset: "${name}"`
    );
  }
  presetRegistry[name] = preset;
}

/**
 * Unregister an animation preset
 * @param name - Preset name to remove
 * @returns true if preset was found and removed
 */
export function unregisterPreset(name: string): boolean {
  if (!presetRegistry[name]) return false;
  delete presetRegistry[name];
  return true;
}

/**
 * Get all registered preset names
 */
export function getPresetNames(): string[] {
  return Object.keys(presetRegistry);
}

/**
 * Create a custom animation preset
 */
export function createPreset(
  config: Partial<AnimationPresetConfig> & {
    enter: AnimationPresetConfig['enter'];
    exit: AnimationPresetConfig['exit'];
  }
): AnimationPresetConfig {
  return {
    enter: config.enter,
    exit: config.exit,
    config: {
      duration: 300,
      easing: 'easeOut',
      ...config.config,
    },
  };
}
