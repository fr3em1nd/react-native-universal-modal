import type { RefObject } from 'react';

/**
 * ARIA role for modal dialog
 */
export type ModalRole = 'dialog' | 'alertdialog';

/**
 * Accessibility configuration for modals
 */
export interface AccessibilityConfig {
  /** Screen reader announcement when modal opens */
  openAnnouncement?: string;
  /** Screen reader announcement when modal closes */
  closeAnnouncement?: string;
  /** Accessible label for the modal */
  accessibilityLabel?: string;
  /** Accessible hint for the modal */
  accessibilityHint?: string;
  /** Whether to trap focus inside modal (web only) */
  trapFocus?: boolean;
  /** Whether to restore focus when modal closes */
  restoreFocus?: boolean;
  /** Element to focus when modal opens */
  initialFocusRef?: RefObject<unknown>;
  /** Element to return focus to when modal closes */
  returnFocusRef?: RefObject<unknown>;
  /** Whether Escape key closes the modal (web) */
  closeOnEscape?: boolean;
  /** Whether Android back button closes the modal */
  closeOnBackButton?: boolean;
  /** ARIA role for the modal (web) */
  role?: ModalRole;
  /** Whether this is a modal dialog */
  modal?: boolean;
  /** ID of the element that labels the modal */
  ariaLabelledBy?: string;
  /** ID of the element that describes the modal */
  ariaDescribedBy?: string;
}

/**
 * Focus trap configuration
 */
export interface FocusTrapConfig {
  /** Allow clicks outside the focus trap */
  allowOutsideClick?: boolean;
  /** CSS selectors for elements that can receive focus outside the trap */
  allowedOutsideElements?: string[];
  /** Prevent scroll on elements outside the trap */
  preventScroll?: boolean;
  /** Element to focus initially (CSS selector or false to disable) */
  initialFocus?: string | false;
  /** Return focus to previous element when deactivated */
  returnFocusOnDeactivate?: boolean;
  /** Callback when user attempts to escape the trap */
  onEscapeAttempt?: () => void;
}

/**
 * Props for FocusTrap component
 */
export interface FocusTrapProps {
  /** Whether the focus trap is active */
  active?: boolean;
  /** Focus trap configuration */
  config?: FocusTrapConfig;
  /** Children to render inside the focus trap */
  children: React.ReactNode;
}

/**
 * Announcement priority level
 */
export type AnnouncementPriority = 'polite' | 'assertive';

/**
 * Announcement message
 */
export interface AnnouncementMessage {
  /** Unique identifier for this announcement */
  id: string;
  /** The message to announce */
  message: string;
  /** Priority level */
  priority: AnnouncementPriority;
  /** Timestamp when created */
  timestamp: number;
}

/**
 * Return type for useAnnouncer hook
 */
export interface UseAnnouncerReturn {
  /** Announce a message to screen readers */
  announce: (message: string, priority?: AnnouncementPriority) => void;
  /** Clear all pending announcements */
  clear: () => void;
}

/**
 * Return type for useFocusTrap hook
 */
export interface UseFocusTrapReturn {
  /** Ref to attach to the focus trap container */
  containerRef: RefObject<HTMLElement>;
  /** Activate the focus trap */
  activate: () => void;
  /** Deactivate the focus trap */
  deactivate: () => void;
  /** Whether the focus trap is currently active */
  isActive: boolean;
}

/**
 * Options for useFocusRestoration hook
 */
export interface UseFocusRestorationOptions {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Whether focus restoration is enabled */
  enabled?: boolean;
  /** Ref to element to return focus to */
  returnFocusRef?: RefObject<unknown>;
}

/**
 * Return type for useEscapeKey hook
 */
export interface UseEscapeKeyOptions {
  /** Whether the escape key handler is enabled */
  enabled?: boolean;
  /** Callback when escape is pressed */
  onEscape: () => void;
}

/**
 * Return type for useBackHandler hook
 */
export interface UseBackHandlerOptions {
  /** Whether the back handler is enabled */
  enabled?: boolean;
  /** Callback when back button is pressed. Return true to prevent default behavior */
  onBack: () => boolean;
}

/**
 * ARIA props for web
 */
export interface AriaProps {
  role?: string;
  'aria-modal'?: boolean;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}
