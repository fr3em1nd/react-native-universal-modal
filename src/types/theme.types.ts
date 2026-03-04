import type { ViewStyle, TextStyle } from 'react-native';
import type { AnimationPresetName, AnimationConfig } from './animation.types';

/**
 * Backdrop theme configuration
 */
export interface BackdropTheme {
  /** Backdrop background color */
  color?: string;
  /** Backdrop opacity (0-1) */
  opacity?: number;
  /** Blur amount (iOS/web only, requires additional setup) */
  blur?: number;
}

/**
 * Modal content theme configuration
 */
export interface ContentTheme {
  /** Content container background color */
  backgroundColor?: string;
  /** Border radius */
  borderRadius?: number;
  /** Padding */
  padding?: number;
  /** Shadow configuration */
  shadow?: ShadowTheme;
  /** Maximum width (useful for web) */
  maxWidth?: number | string;
  /** Maximum height */
  maxHeight?: number | string;
}

/**
 * Shadow theme configuration
 */
export interface ShadowTheme {
  /** Shadow color */
  color?: string;
  /** Shadow offset */
  offset?: { width: number; height: number };
  /** Shadow opacity (iOS) */
  opacity?: number;
  /** Shadow radius (iOS) / elevation (Android) */
  radius?: number;
  /** Elevation (Android) */
  elevation?: number;
}

/**
 * Animation theme configuration
 */
export interface AnimationTheme {
  /** Default animation preset */
  preset?: AnimationPresetName;
  /** Default animation duration */
  duration?: number;
  /** Default animation config */
  config?: AnimationConfig;
}

/**
 * Typography theme for modal content
 */
export interface TypographyTheme {
  /** Title text style */
  title?: TextStyle;
  /** Body text style */
  body?: TextStyle;
  /** Button text style */
  button?: TextStyle;
}

/**
 * Color palette for theming
 */
export interface ColorPalette {
  /** Primary color */
  primary?: string;
  /** Secondary color */
  secondary?: string;
  /** Background color */
  background?: string;
  /** Surface color */
  surface?: string;
  /** Text color */
  text?: string;
  /** Text on primary color */
  textOnPrimary?: string;
  /** Border color */
  border?: string;
  /** Error color */
  error?: string;
  /** Success color */
  success?: string;
}

/**
 * Complete modal theme
 */
export interface ModalTheme {
  /** Color palette */
  colors?: ColorPalette;
  /** Backdrop configuration */
  backdrop?: BackdropTheme;
  /** Content configuration */
  content?: ContentTheme;
  /** Animation configuration */
  animation?: AnimationTheme;
  /** Typography configuration */
  typography?: TypographyTheme;
  /** Custom styles */
  custom?: Record<string, ViewStyle | TextStyle>;
}

/**
 * Theme context value
 */
export interface ThemeContextValue {
  /** Current theme */
  theme: ModalTheme;
  /** Whether dark mode is active */
  isDark: boolean;
  /** Set a new theme */
  setTheme: (theme: ModalTheme) => void;
  /** Toggle dark mode */
  toggleDarkMode: () => void;
}

/**
 * Props for ThemeProvider component
 */
export interface ThemeProviderProps {
  /** Children to render */
  children: React.ReactNode;
  /** Initial theme */
  theme?: ModalTheme;
  /** Initial dark mode state */
  darkMode?: boolean;
  /** Dark mode theme (used when darkMode is true) */
  darkTheme?: ModalTheme;
}

/**
 * Global modal configuration
 */
export interface GlobalModalConfig {
  /** Default modal configuration applied to all modals */
  defaults?: {
    /** Default animation */
    animation?: AnimationPresetName;
    /** Default animation duration */
    animationDuration?: number;
    /** Default backdrop opacity */
    backdropOpacity?: number;
    /** Default backdrop color */
    backdropColor?: string;
    /** Close on backdrop press by default */
    closeOnBackdropPress?: boolean;
    /** Close on escape key by default (web) */
    closeOnEscape?: boolean;
    /** Close on back button by default (Android) */
    closeOnBackButton?: boolean;
    /** Trap focus by default (web) */
    trapFocus?: boolean;
    /** Restore focus by default */
    restoreFocus?: boolean;
    /** Avoid keyboard by default */
    avoidKeyboard?: boolean;
  };
  /** Theme configuration */
  theme?: ModalTheme;
  /** Dark mode theme */
  darkTheme?: ModalTheme;
  /** Base z-index for modals */
  baseZIndex?: number;
  /** Z-index increment between stacked modals */
  zIndexIncrement?: number;
  /** Enable debug mode */
  debug?: boolean;
}
