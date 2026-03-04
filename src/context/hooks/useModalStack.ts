import { useContext, useSyncExternalStore, useCallback } from 'react';
import { ModalStackContext, type ModalStackContextValue } from '../ModalStackContext';
import { useModalContext } from './useModalContext';
import type { ModalId, ModalStackEntry } from '../../types';

/**
 * Hook to access the stack context for a modal
 * Must be used within a modal component
 */
export function useModalStackContext(): ModalStackContextValue {
  const context = useContext(ModalStackContext);

  if (context === null) {
    throw new Error(
      'useModalStackContext must be used within a modal component. ' +
        'This hook provides stack-specific information for the current modal.'
    );
  }

  return context;
}

/**
 * Hook to subscribe to stack changes
 * Returns the current stack state and re-renders when it changes
 */
export function useModalStackState() {
  const { stackManager } = useModalContext();

  const subscribe = useCallback(
    (callback: () => void) => stackManager.subscribe(callback),
    [stackManager]
  );

  const getSnapshot = useCallback(
    () => ({
      stack: stackManager.getStack(),
      topModalId: stackManager.getTopModal(),
      isEmpty: stackManager.isEmpty(),
      size: stackManager.getStackSize(),
    }),
    [stackManager]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Hook to check if a specific modal is the top modal
 * @param modalId - The modal ID to check
 */
export function useIsTopModal(modalId: ModalId): boolean {
  const { stackManager } = useModalContext();

  const subscribe = useCallback(
    (callback: () => void) => stackManager.subscribe(callback),
    [stackManager]
  );

  const getSnapshot = useCallback(
    () => stackManager.isTopModal(modalId),
    [stackManager, modalId]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Hook to get the position of a modal in the stack
 * @param modalId - The modal ID to check
 * @returns Position (0-indexed) or -1 if not in stack
 */
export function useStackPosition(modalId: ModalId): number {
  const { stackManager } = useModalContext();

  const subscribe = useCallback(
    (callback: () => void) => stackManager.subscribe(callback),
    [stackManager]
  );

  const getSnapshot = useCallback(
    () => stackManager.getStackPosition(modalId),
    [stackManager, modalId]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Hook to get stack utilities
 * Provides methods to query and manipulate the stack
 */
export function useModalStackUtils() {
  const { stackManager } = useModalContext();

  return {
    /**
     * Check if a modal is in the stack
     */
    has: useCallback(
      (id: ModalId) => stackManager.has(id),
      [stackManager]
    ),

    /**
     * Get the z-index for a modal
     */
    getZIndex: useCallback(
      (id: ModalId) => stackManager.getZIndex(id),
      [stackManager]
    ),

    /**
     * Check if a modal is the topmost
     */
    isTop: useCallback(
      (id: ModalId) => stackManager.isTopModal(id),
      [stackManager]
    ),

    /**
     * Get the current stack
     */
    getStack: useCallback(
      (): ReadonlyArray<ModalStackEntry> => stackManager.getStack(),
      [stackManager]
    ),

    /**
     * Get the top modal ID
     */
    getTopModal: useCallback(
      (): ModalId | null => stackManager.getTopModal(),
      [stackManager]
    ),

    /**
     * Close all modals
     */
    closeAll: useCallback(
      (): ModalId[] => stackManager.closeAll(),
      [stackManager]
    ),

    /**
     * Close the top N modals
     */
    closeTop: useCallback(
      (count = 1): ModalId[] => stackManager.closeTop(count),
      [stackManager]
    ),
  };
}
