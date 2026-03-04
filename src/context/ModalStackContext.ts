import { createContext } from 'react';
import type { ModalId } from '../types';

/**
 * Per-modal stack context value
 * Provides stack-specific information to each modal
 */
export interface ModalStackContextValue {
  /** This modal's unique identifier */
  modalId: ModalId;
  /** This modal's z-index */
  zIndex: number;
  /** Whether this modal is the topmost in the stack */
  isTopModal: boolean;
  /** Position in the stack (0 = bottom) */
  stackPosition: number;
  /** Total number of modals in the stack */
  stackSize: number;
}

/**
 * Context provided to each modal instance
 * Contains stack-specific information for the modal
 */
export const ModalStackContext = createContext<ModalStackContextValue | null>(null);

// Display name for React DevTools
ModalStackContext.displayName = 'ModalStackContext';
