/**
 * react-native-universal-modal
 *
 * A fully customizable, accessible, cross-platform modal system
 * for React Native (iOS, Android, Web)
 */

// ============================================================================
// Core Components
// ============================================================================

export { UniversalModal } from './components/UniversalModal';
export { ModalRoot } from './core/ModalRoot';
export { ModalProvider, withModalProvider } from './core/ModalProvider';

// ============================================================================
// Hooks
// ============================================================================

// Main hooks
export { useModal, type UseModalReturn } from './context/hooks/useModal';
export {
  useModalContext,
  useModalDispatch,
  useModalState,
} from './context/hooks/useModalContext';

// Stack hooks
export {
  useModalStackContext,
  useModalStackState,
  useIsTopModal,
  useStackPosition,
  useModalStackUtils,
} from './context/hooks/useModalStack';

// ============================================================================
// Imperative API
// ============================================================================

export { ModalController } from './core/ModalController';

// ============================================================================
// Animation
// ============================================================================

export {
  useAnimationEngine,
  isReanimatedAvailable,
  getPreset,
  registerPreset,
  createPreset,
  getPresetNames,
} from './animation';

// Animation presets
export {
  fadePreset,
  slideUpPreset,
  slideDownPreset,
  slideLeftPreset,
  slideRightPreset,
  scalePreset,
  bouncePreset,
  springPreset,
  nonePreset,
} from './animation/presets';

// Shared transitions
export {
  SharedTransitionProvider,
  useSharedTransitionContext,
  useSharedTransition,
} from './animation/transitions';

// ============================================================================
// Theming
// ============================================================================

export { ThemeProvider, useTheme, useModalTheme } from './themes';
export { defaultTheme, darkTheme } from './themes';

// ============================================================================
// Accessibility
// ============================================================================

export { FocusTrap } from './accessibility/FocusTrap';
export { AccessibilityAnnouncer, useAnnouncer } from './accessibility/Announcer';
export { useEscapeKey } from './accessibility/keyboard/useEscapeKey';
export { useBackHandler } from './accessibility/keyboard/useBackHandler';
export { useAriaProps, generateAriaId, generateAriaIds } from './accessibility/aria';
export { useFocusRestoration } from './accessibility/useFocusRestoration';

// ============================================================================
// Building Blocks (for custom modals)
// ============================================================================

export { ModalBackdrop } from './components/ModalBackdrop';
export { ModalContainer } from './components/ModalContainer';
export { ModalContent } from './components/ModalContent';
export { ModalPortal } from './components/ModalPortal';

// ============================================================================
// Core Classes (advanced usage)
// ============================================================================

export { ModalStackManager } from './core/ModalStackManager';
export { ModalRegistry } from './core/ModalRegistry';

// ============================================================================
// Utilities
// ============================================================================

export { generateId } from './utils/generateId';
export { mergeRefs } from './utils/mergeRefs';
export {
  isWeb,
  isIOS,
  isAndroid,
  isNative,
  platformName,
  selectPlatform,
} from './utils/platform';

// ============================================================================
// Types
// ============================================================================

export type {
  // Modal types
  ModalId,
  ModalState,
  ModalInjectedProps,
  ModalComponent,
  ModalConfig,
  ShowModalOptions,
  ActiveModal,
  ModalStackEntry,
  ModalResult,
  ModalStateShape,
  ModalAction,
  ModalProviderProps,
  UniversalModalProps,
  RegisteredModal,

  // Animation types
  AnimationPresetName,
  CustomAnimation,
  AnimationType,
  AnimationValues,
  EasingName,
  EasingFunction,
  AnimationConfig,
  AnimationPresetConfig,
  AnimationState,
  UseAnimationEngineOptions,
  UseAnimationEngineReturn,
  SharedTransitionConfig,
  ModalAnimationState,

  // Accessibility types
  ModalRole,
  AccessibilityConfig,
  FocusTrapConfig,
  FocusTrapProps,
  AnnouncementPriority,
  AnnouncementMessage,
  UseAnnouncerReturn,
  UseFocusTrapReturn,
  UseFocusRestorationOptions,
  UseEscapeKeyOptions,
  UseBackHandlerOptions,
  AriaProps,

  // Theme types
  BackdropTheme,
  ContentTheme,
  ShadowTheme,
  AnimationTheme,
  TypographyTheme,
  ColorPalette,
  ModalTheme,
  ThemeContextValue,
  ThemeProviderProps,
  GlobalModalConfig,
} from './types';
