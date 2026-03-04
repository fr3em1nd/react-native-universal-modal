import type { ComponentType, ReactNode } from 'react';
import type { ViewStyle, StyleProp } from 'react-native';
import type { AnimationType, AnimationConfig } from './animation.types';

/**
 * Unique identifier for a modal instance
 */
export type ModalId = string;

/**
 * Modal lifecycle state
 */
export type ModalState = 'entering' | 'visible' | 'exiting' | 'hidden';

/**
 * Props injected into modal components by the library
 */
export interface ModalInjectedProps {
  /** Unique identifier for this modal instance */
  modalId: ModalId;
  /** Function to close this modal with an optional result */
  hide: <T = void>(result?: T) => void;
  /** Whether this modal is currently the topmost in the stack */
  isTopModal: boolean;
  /** Position in the modal stack (0 = bottom) */
  stackPosition: number;
}

/**
 * A component that can be rendered as a modal
 */
export type ModalComponent<TProps = object, TResult = void> = ComponentType<
  TProps & Partial<ModalInjectedProps>
>;

/**
 * Configuration for a modal
 */
export interface ModalConfig {
  /** Priority level for stack ordering (higher = on top) */
  priority?: number;
  /** Animation type for entering */
  animationIn?: AnimationType;
  /** Animation type for exiting */
  animationOut?: AnimationType;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdropPress?: boolean;
  /** Whether pressing Escape closes the modal (web only) */
  closeOnEscape?: boolean;
  /** Whether pressing back button closes the modal (Android only) */
  closeOnBackButton?: boolean;
  /** Whether to avoid the keyboard on mobile */
  avoidKeyboard?: boolean;
  /** Backdrop opacity (0-1) */
  backdropOpacity?: number;
  /** Backdrop color */
  backdropColor?: string;
  /** Custom modal container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Custom modal content style */
  contentStyle?: StyleProp<ViewStyle>;
  /** Accessibility label for the modal */
  accessibilityLabel?: string;
  /** Whether to trap focus inside the modal (web) */
  trapFocus?: boolean;
  /** Whether to restore focus when modal closes */
  restoreFocus?: boolean;
  /** Screen reader announcement when modal opens */
  openAnnouncement?: string;
  /** Screen reader announcement when modal closes */
  closeAnnouncement?: string;
}

/**
 * Options passed when showing a modal imperatively
 */
export interface ShowModalOptions extends ModalConfig {
  /** Custom modal ID (auto-generated if not provided) */
  id?: ModalId;
}

/**
 * An active modal in the stack
 */
export interface ActiveModal<TProps = Record<string, unknown>> {
  /** Unique identifier */
  id: ModalId;
  /** Z-index for layering */
  zIndex: number;
  /** The modal component to render */
  component: ModalComponent<TProps, unknown>;
  /** Props to pass to the modal component */
  props: TProps;
  /** Current lifecycle state */
  state: ModalState;
  /** Configuration for this modal */
  config: ModalConfig;
}

/**
 * Entry in the modal stack
 */
export interface ModalStackEntry {
  /** Modal identifier */
  id: ModalId;
  /** Z-index value */
  zIndex: number;
  /** Priority level */
  priority: number;
  /** Timestamp when added to stack */
  timestamp: number;
}

/**
 * Result returned when a modal is closed
 */
export interface ModalResult<T = void> {
  /** The result data if modal was closed with a value */
  data: T | undefined;
  /** Whether the modal was dismissed (closed without a result) */
  dismissed: boolean;
}

/**
 * Global modal state
 */
export interface ModalStateShape {
  /** Currently active modals */
  activeModals: ActiveModal[];
  /** Whether any modal is currently visible */
  isAnyModalVisible: boolean;
  /** ID of the topmost modal */
  topModalId: ModalId | null;
}

/**
 * Modal action types
 */
export type ModalAction =
  | { type: 'SHOW_MODAL'; payload: ActiveModal }
  | { type: 'HIDE_MODAL'; payload: { id: ModalId } }
  | { type: 'REMOVE_MODAL'; payload: { id: ModalId } }
  | { type: 'UPDATE_MODAL_STATE'; payload: { id: ModalId; state: ModalState } }
  | { type: 'UPDATE_MODAL_PROPS'; payload: { id: ModalId; props: Record<string, unknown> } };

/**
 * Props for the ModalProvider component
 */
export interface ModalProviderProps {
  /** Child components */
  children: ReactNode;
  /** Global configuration applied to all modals */
  config?: ModalConfig;
  /** Base z-index for modal layering */
  baseZIndex?: number;
}

/**
 * Props for the UniversalModal component (declarative API)
 */
export interface UniversalModalProps extends ModalConfig {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when the modal requests to be closed */
  onClose: () => void;
  /** Callback when the modal is shown */
  onShow?: () => void;
  /** Callback when the modal is dismissed */
  onDismiss?: () => void;
  /** Callback when animation starts */
  onAnimationStart?: () => void;
  /** Callback when animation ends */
  onAnimationEnd?: () => void;
  /** Modal content */
  children: ReactNode;
  /** Animation preset name or custom animation */
  animation?: AnimationType;
  /** Custom animation configuration */
  animationConfig?: AnimationConfig;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Registered modal for imperative API
 */
export interface RegisteredModal<TProps = Record<string, unknown>, TResult = void> {
  /** Modal identifier */
  id: ModalId;
  /** The modal component */
  component: ModalComponent<TProps, TResult>;
  /** Default configuration */
  config: ModalConfig;
  /** Current props */
  props: TProps | null;
  /** Promise resolver for result */
  resolve: ((result: TResult | undefined) => void) | null;
}
