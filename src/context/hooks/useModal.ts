/**
 * useModal - Imperative hook for showing modals
 */

import { useCallback, useRef } from 'react';
import { useModalContext, useModalDispatch } from './useModalContext';
import type {
  ModalComponent,
  ModalConfig,
  ShowModalOptions,
  ModalResult,
  ModalId,
} from '../../types';

/**
 * Return type for useModal hook
 */
export interface UseModalReturn<TProps, TResult> {
  /** Show the modal with optional props and options */
  show: (props?: TProps, options?: ShowModalOptions) => Promise<ModalResult<TResult>>;
  /** Hide the modal with an optional result */
  hide: (result?: TResult) => void;
  /** Whether the modal is currently visible */
  isVisible: boolean;
  /** The modal's ID (null if not currently shown) */
  modalId: ModalId | null;
}

/**
 * useModal - Hook for imperatively showing modals
 *
 * Usage:
 * ```tsx
 * const MyModal = ({ name, hide }) => (
 *   <View>
 *     <Text>Hello, {name}!</Text>
 *     <Button onPress={() => hide('confirmed')} title="Confirm" />
 *   </View>
 * );
 *
 * function App() {
 *   const { show, hide, isVisible } = useModal(MyModal);
 *
 *   const handlePress = async () => {
 *     const result = await show({ name: 'World' });
 *     if (result.data === 'confirmed') {
 *       console.log('User confirmed!');
 *     }
 *   };
 *
 *   return <Button onPress={handlePress} title="Open Modal" />;
 * }
 * ```
 *
 * @param Component - The modal component to render
 * @param defaultConfig - Default configuration for the modal
 */
export function useModal<TProps = Record<string, unknown>, TResult = void>(
  Component: ModalComponent<TProps, TResult>,
  defaultConfig: ModalConfig = {}
): UseModalReturn<TProps, TResult> {
  const { stackManager, registry, state } = useModalContext();
  const { dispatch } = useModalDispatch();

  const modalIdRef = useRef<ModalId | null>(null);
  const resolverRef = useRef<((result: ModalResult<TResult>) => void) | null>(null);

  /**
   * Show the modal
   */
  const show = useCallback(
    async (
      props?: TProps,
      options?: ShowModalOptions
    ): Promise<ModalResult<TResult>> => {
      // If already visible, return existing promise
      if (modalIdRef.current) {
        return new Promise<ModalResult<TResult>>((resolve) => {
          resolverRef.current = resolve;
        });
      }

      // Generate ID or use provided one
      const id = options?.id ?? registry.generateId();
      modalIdRef.current = id;

      // Merge configs
      const config: ModalConfig = {
        ...defaultConfig,
        ...options,
      };

      // Push to stack
      const priority = config.priority ?? 0;
      const { zIndex } = stackManager.push(id, priority);

      // Create result promise
      const resultPromise = new Promise<ModalResult<TResult>>((resolve) => {
        resolverRef.current = resolve;
      });

      // Dispatch show action
      dispatch({
        type: 'SHOW_MODAL',
        payload: {
          id,
          zIndex,
          component: Component as ModalComponent,
          props: (props ?? {}) as Record<string, unknown>,
          state: 'entering',
          config,
        },
      });

      return resultPromise;
    },
    [Component, defaultConfig, dispatch, registry, stackManager]
  );

  /**
   * Hide the modal with an optional result
   */
  const hide = useCallback(
    (result?: TResult) => {
      const id = modalIdRef.current;
      if (!id) return;

      // Resolve the promise
      if (resolverRef.current) {
        resolverRef.current({
          data: result,
          dismissed: result === undefined,
        });
        resolverRef.current = null;
      }

      // Dispatch hide action
      dispatch({ type: 'HIDE_MODAL', payload: { id } });

      // Cleanup after animation (handled by ModalPortal)
      modalIdRef.current = null;
    },
    [dispatch]
  );

  // Check if modal is visible
  const isVisible = modalIdRef.current
    ? state.activeModals.some(
        (m) => m.id === modalIdRef.current && m.state !== 'exiting'
      )
    : false;

  return {
    show,
    hide,
    isVisible,
    modalId: modalIdRef.current,
  };
}
