// Modal types
export type {
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
} from './modal.types';

// Animation types
export type {
  AnimationPresetName,
  CustomAnimation,
  AnimationType,
  AnimationValues,
  EasingName,
  EasingFunction,
  AnimationConfig,
  AnimationPresetConfig,
  AnimationState,
  AnimationEngine,
  UseAnimationEngineOptions,
  UseAnimationEngineReturn,
  SharedTransitionConfig,
  ModalAnimationState,
} from './animation.types';

// Accessibility types
export type {
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
} from './accessibility.types';

// Theme types
export type {
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
} from './theme.types';
