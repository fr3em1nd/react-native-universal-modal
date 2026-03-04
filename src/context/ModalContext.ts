import { createContext } from 'react';
import type {
  ModalStateShape,
  ModalAction,
  ModalConfig,
} from '../types';
import type { ModalStackManager } from '../core/ModalStackManager';
import type { ModalRegistry } from '../core/ModalRegistry';

/**
 * Value provided by ModalContext (read-only state)
 */
export interface ModalContextValue {
  /** Current modal state */
  state: ModalStateShape;
  /** Stack manager instance */
  stackManager: ModalStackManager;
  /** Modal registry instance */
  registry: ModalRegistry;
  /** Global configuration */
  config: ModalConfig;
}

/**
 * Value provided by ModalDispatchContext (actions)
 */
export interface ModalDispatchContextValue {
  /** Dispatch function for modal actions */
  dispatch: React.Dispatch<ModalAction>;
}

/**
 * Context for modal state (read-only)
 * Split from dispatch to prevent re-renders when only dispatching
 */
export const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Context for modal dispatch (actions)
 * Split from state to prevent re-renders when only reading
 */
export const ModalDispatchContext = createContext<ModalDispatchContextValue | null>(null);

// Display names for React DevTools
ModalContext.displayName = 'ModalContext';
ModalDispatchContext.displayName = 'ModalDispatchContext';
